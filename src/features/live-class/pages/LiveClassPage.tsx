import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video, VideoOff, MonitorUp, 
  Hand, MessageSquare, Users, Settings, 
  PhoneOff, Send, Maximize,
  X
} from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/context/AuthContext';
import { toast } from 'react-toastify';
import type { RealtimeChannel } from '@supabase/supabase-js';
import AgoraRTC, { 
  AgoraRTCProvider, 
  useRTCClient,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useRemoteAudioTracks,
  useRemoteVideoTracks,
  RemoteUser,
} from "agora-rtc-react";

const VideoPlayer = ({ track, isScreenShare = false }: { track: any, isScreenShare?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (track && ref.current) {
      track.play(ref.current, { fit: isScreenShare ? "contain" : "cover" });
    }
    return () => {
      if (track) {
        track.stop();
      }
    };
  }, [track, isScreenShare]);
  return <div ref={ref} className={`w-full h-full [&>div>video]:${isScreenShare ? '!object-contain' : '!object-cover'}`} />;
};

const LiveClassRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState('');
  const [isHandRaised, setIsHandRaised] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Real-time states
  const [messages, setMessages] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [roomChannel, setRoomChannel] = useState<RealtimeChannel | null>(null);
  const { sessionId = "default-room" } = useParams();

  // Session metadata from DB
  const [sessionInfo, setSessionInfo] = useState<{ title: string; batch: string; tutor_name: string } | null>(null);

  useEffect(() => {
    supabase
      .from('live_sessions')
      .select('title, batch, profiles:tutor_id(full_name)')
      .eq('id', sessionId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setSessionInfo({
            title: data.title,
            batch: data.batch,
            tutor_name: (data.profiles as any)?.full_name || 'Tutor',
          });
        }
      });
  }, [sessionId]);
  
  
  // --- Agora Setup ---
  const appId = import.meta.env.VITE_AGORA_APP_ID || "test-app-id";
  const isJoined = true;
  
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(isJoined);
  const { localCameraTrack } = useLocalCameraTrack(isJoined);

  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenTrack, setScreenTrack] = useState<any>(null);

  const toggleScreenShare = async () => {
    if (isScreenSharing && screenTrack) {
      screenTrack.close();
      setScreenTrack(null);
      setIsScreenSharing(false);
    } else {
      try {
        const track = await AgoraRTC.createScreenVideoTrack({
          encoderConfig: "1080p_1",
          optimizationMode: "detail"
        }, "auto");
        
        const videoTrack = Array.isArray(track) ? track[0] : track;
        
        videoTrack.on("track-ended", () => {
          videoTrack.close();
          setScreenTrack(null);
          setIsScreenSharing(false);
        });
        
        setScreenTrack(videoTrack);
        setIsScreenSharing(true);
      } catch (error) {
        console.error("Failed to start screen share", error);
        toast.error("Could not share screen");
      }
    }
  };
  
  // Set enabled states based on UI toggles without destroying tracks
  useEffect(() => {
    if (localMicrophoneTrack) localMicrophoneTrack.setEnabled(!isMuted);
  }, [isMuted, localMicrophoneTrack]);

  useEffect(() => {
    if (localCameraTrack) localCameraTrack.setEnabled(!isVideoOff);
  }, [isVideoOff, localCameraTrack]);

  const tracksToPublish = useMemo(() => {
    const tracks = [];
    if (localMicrophoneTrack) tracks.push(localMicrophoneTrack);
    if (screenTrack) {
      tracks.push(screenTrack);
    } else if (localCameraTrack) {
      tracks.push(localCameraTrack);
    }
    return tracks;
  }, [localMicrophoneTrack, localCameraTrack, screenTrack]);

  usePublish(tracksToPublish);

  useJoin({
    appid: appId,
    channel: sessionId,
    token: null,
    uid: user?.id
  }, isJoined);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const { videoTracks: remoteVideoTracks } = useRemoteVideoTracks(remoteUsers);

  // The first remote video track is always the teacher's feed (camera or screen share)
  const teacherVideoTrack = remoteVideoTracks[0] ?? null;

  // Identify Host before any effects that depend on it
  const isHost = ['admin', 'tutor'].includes(user?.role?.toLowerCase() || '');

  useEffect(() => {
    audioTracks.forEach(track => track.play());
  }, [audioTracks]);

  // Play remote video track (camera or screen share) in the student view
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isHost && teacherVideoTrack && remoteVideoRef.current) {
      const isScreen = teacherVideoTrack.getMediaStreamTrack?.()?.label?.toLowerCase().includes('screen') ||
                       teacherVideoTrack.getMediaStreamTrack?.()?.label?.toLowerCase().includes('display');
      teacherVideoTrack.play(remoteVideoRef.current, { fit: isScreen ? 'contain' : 'cover' });
    }
    return () => {
      if (!isHost && teacherVideoTrack) teacherVideoTrack.stop();
    };
  }, [teacherVideoTrack, isHost]);
  // -------------------

  // 🔴 End-class auto-redirect for students
  useEffect(() => {
    if (!sessionId || isHost) return;
    const endWatcher = supabase
      .channel(`end-watch-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'live_sessions', filter: `id=eq.${sessionId}` },
        (payload) => {
          if (payload.new.status === 'ended') {
            toast.info('The class has ended. Redirecting to dashboard...', { icon: () => <span>📚</span> });
            setTimeout(() => navigate('/dashboard'), 2500);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(endWatcher); };
  }, [sessionId, isHost, navigate]);
  // -------------------

  useEffect(() => {
    if (!user) return;

    fetchMessages();

    // 1. Subscribe to Realtime Chat
    const chatChannel = supabase
      .channel('live-chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'live_messages', filter: `session_id=eq.${sessionId}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    // 2. Presence Channel for Attendance & States (Zero DB Overhead)
    const presenceChannel = supabase.channel(`room-${sessionId}`, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const activeParticipants = Object.values(state).map((presences: any) => presences[0]);
        
        setParticipants(prevParticipants => {
          // Show notification if someone raised their hand
          if (['admin', 'tutor'].includes(user?.role?.toLowerCase() || '')) {
            activeParticipants.forEach(p => {
              const existingP = prevParticipants.find(ep => ep.id === p.id);
              if (p.isHandRaised && (!existingP || !existingP.isHandRaised)) {
                toast.info(`${p.name} raised their hand!`, { icon: () => <span>✋</span> });
              }
            });
          }
          return activeParticipants;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            id: user.id,
            name: user.name,
            role: ['admin', 'tutor'].includes(user?.role?.toLowerCase() || '') ? 'Host' : 'Student',
            isMuted,
            isVideoOff,
            isHandRaised,
            avatar: user.avatar
          });
        }
      });

    setRoomChannel(presenceChannel);

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(presenceChannel);
    };
  }, [user]);

  // Sync local UI states to Presence when toggled
  useEffect(() => {
    if (roomChannel && user) {
      roomChannel.track({
        id: user.id,
        name: user.name,
        role: user.role === 'student' ? 'Student' : 'Host',
        isMuted,
        isVideoOff,
        isHandRaised,
        avatar: user.avatar
      });
    }
  }, [isMuted, isVideoOff, isHandRaised, roomChannel, user]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('live_messages')
      .select('id, user_id, user_name, message, is_teacher, created_at')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (data) setMessages(data.reverse());
    setTimeout(scrollToBottom, 100);
  };



  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || !user) return;
    
    const newMessage = {
      session_id: sessionId,
      user_id: user.id,
      user_name: user.name,
      message: chatMessage,
      is_teacher: ['admin', 'tutor'].includes(user?.role?.toLowerCase() || '')
    };

    const { error } = await supabase.from('live_messages').insert(newMessage);
    
    if (error) {
      toast.error("Failed to send message");
    } else {
      setChatMessage('');
    }
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    if (!isHandRaised) {
      toast.info("Your hand is raised! The teacher will address you shortly.", {
        icon: () => <span>✋</span>,
        position: "bottom-center"
      });
    }
  };

  return (
    <div className="h-[100dvh] bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      
      {/* Header Info */}
      <div className="h-12 md:h-14 bg-[#111] border-b border-white/5 flex items-center justify-between px-3 md:px-6 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 truncate">
          <div className="bg-red-500/20 text-red-500 px-2 py-0.5 md:px-3 md:py-1 rounded flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-black tracking-wider">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse"></div>
            LIVE
          </div>
          <h1 className="text-xs md:text-lg font-medium text-white/90 border-l border-white/10 pl-2 md:pl-4 truncate">
            {sessionInfo?.title || 'Live Class'}
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-white/50">
          <span className="bg-white/5 px-2 py-0.5 md:px-3 md:py-1 rounded hidden sm:inline">{sessionInfo?.batch || 'Live'}</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Video Area */}
        <div className="flex-1 flex flex-col p-2 md:p-4 gap-2 md:gap-4 relative overflow-hidden">
          
          {/* Main Presenter / Screen Share */}
          <div className="flex-1 bg-[#111] rounded-xl md:rounded-2xl border border-white/5 overflow-hidden relative group">
            {isHost ? (
              (isScreenSharing && screenTrack) || (localCameraTrack && !isVideoOff) ? (
                <div className="absolute inset-0">
                  <VideoPlayer track={isScreenSharing ? screenTrack : localCameraTrack} isScreenShare={isScreenSharing} />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a251a] to-[#0a0f0a]">
                  <div className="text-center p-4">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                      <span className="text-3xl md:text-5xl">👨‍🏫</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold text-white/80">Your Camera is Off</h3>
                  </div>
                </div>
              )
            ) : (
              <>
                {/* Always mounted so ref is always attached — visibility toggled via CSS */}
                <div
                  ref={remoteVideoRef}
                  className="absolute inset-0"
                  style={{ display: teacherVideoTrack ? 'block' : 'none' }}
                />
                {!teacherVideoTrack && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a251a] to-[#0a0f0a]">
                    <div className="text-center p-4">
                      <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                        <span className="text-3xl md:text-5xl">👨‍🏫</span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-bold text-white/80">Waiting for teacher...</h3>
                      <p className="text-white/40 mt-1 md:mt-2 text-xs md:text-sm">Camera or screen share will appear here</p>
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-black/60 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-sm flex items-center gap-1.5 md:gap-2">
              <Mic size={12} className="text-green-400 md:w-3.5 md:h-3.5" />
              <span className="font-bold">{isHost ? (user?.name || 'You') : (sessionInfo?.tutor_name || 'Teacher')}</span>
            </div>
            
            <button className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 md:p-2 bg-black/40 hover:bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize size={14} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>

          {/* Participants Strip with Camera Thumbnails */}
          <div className="h-24 md:h-32 shrink-0 flex gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {/* Tutor's own self-view tile (host only) */}
            {isHost && localCameraTrack && !isVideoOff && (
              <div className="w-32 md:w-48 h-full bg-[#111] rounded-lg md:rounded-xl border border-white/10 shrink-0 relative overflow-hidden">
                <VideoPlayer track={localCameraTrack} />
                <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-[8px] md:text-[9px] px-1.5 py-0.5 rounded font-bold">
                  You
                </div>
              </div>
            )}
            {/* Remote participant tiles with live video */}
            {remoteUsers.map((remoteUser) => (
              <div key={remoteUser.uid} className="w-32 md:w-48 h-full bg-[#111] rounded-lg md:rounded-xl border border-white/10 shrink-0 relative overflow-hidden">
                {remoteUser.hasVideo ? (
                  <RemoteUser user={remoteUser} className="w-full h-full" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
                    <span className="text-xl md:text-3xl opacity-50">👤</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between items-center">
                  <div className="bg-black/70 text-[8px] md:text-[9px] px-1.5 py-0.5 rounded truncate max-w-[100px] font-bold">
                    {participants.find(p => p.id === remoteUser.uid)?.name || `User ${String(remoteUser.uid).slice(0,4)}`}
                  </div>
                  {!remoteUser.hasAudio && <MicOff size={8} className="text-red-400 shrink-0" />}
                </div>
              </div>
            ))}
            {remoteUsers.length === 0 && !isHost && (
              <div className="flex items-center justify-center w-full text-white/20 text-xs italic">No other participants yet</div>
            )}
            {participants.length === 0 && isHost && (
              <div className="flex items-center justify-center w-full text-white/20 text-xs italic">Waiting for students to join...</div>
            )}
          </div>

        </div>

        {/* Right Sidebar (Chat & Participants) */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div 
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              className="absolute md:relative inset-y-0 right-0 w-full md:w-[350px] bg-[#111] border-l border-white/5 flex flex-col z-50 md:z-auto shadow-2xl"
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute -left-10 top-2 p-2 bg-[#111] border border-white/5 rounded-full md:hidden text-white/50"
              >
                <X size={20} />
              </button>
              
              <div className="flex p-2 border-b border-white/5">
                <button 
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                >
                  <MessageSquare size={16} /> Chat
                </button>
                <button 
                  onClick={() => setActiveTab('participants')}
                  className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${activeTab === 'participants' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/80'}`}
                >
                  <Users size={16} /> People ({participants.length})
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {activeTab === 'chat' ? (
                  <>
                    <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.user_id === user?.id ? 'items-end' : 'items-start'}`}>
                          <div className={`flex items-baseline gap-2 mb-1 ${msg.user_id === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                            <span className="text-[10px] font-bold text-white/70">{msg.user_name}</span>
                            {msg.is_teacher && <span className="bg-green-500/20 text-green-400 text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest uppercase">HOST</span>}
                            <span className="text-[9px] text-white/30">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed ${msg.user_id === user?.id ? 'bg-green-600 rounded-tr-sm text-white' : 'bg-white/10 rounded-tl-sm text-white/90'}`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    
                    <form onSubmit={handleSendMessage} className="mt-auto pt-4 relative">
                      <input 
                        type="text" 
                        placeholder="Message to everyone..." 
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-green-500/50 transition-colors"
                      />
                      <button 
                        type="submit" 
                        disabled={!chatMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 p-1.5 bg-green-600 rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:hover:bg-green-600 transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    {participants.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white/70">
                            {p.avatar || p.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white/90">
                              {p.name} {p.id === user?.id && '(You)'}
                            </span>
                            <span className="text-[10px] text-white/40">{p.role}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-white/40">
                          {p.isHandRaised && <Hand size={14} className="text-yellow-500" fill="currentColor" />}
                          {p.isMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} className="text-green-400" />}
                          {p.isVideoOff ? <VideoOff size={14} className="text-red-400" /> : <Video size={14} className="text-green-400" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-20 md:h-24 bg-[#111] border-t border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30 w-full">
        <div className="hidden md:flex items-center gap-4 w-1/4">
            <span className="text-sm font-black text-white/50 uppercase tracking-widest">System Design | 10:02 AM</span>
          </div>

          <div className="flex items-center justify-center gap-2 md:gap-4 flex-1 md:w-1/2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            
            <button 
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}
            >
              {isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
            </button>
            
            <button 
              onClick={toggleScreenShare}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all hidden sm:flex ${isScreenSharing ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-110' : 'bg-white/5 hover:bg-white/10 text-white'}`}
            >
              <MonitorUp size={18} />
            </button>
            
            <button 
              onClick={toggleHandRaise}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all ${isHandRaised ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-110' : 'bg-white/5 hover:bg-white/10 text-white'}`}
            >
              <Hand size={18} fill={isHandRaised ? "currentColor" : "none"} />
            </button>

            <Link to="/dashboard" className="px-4 md:px-6 h-10 md:h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center gap-2 font-black text-[10px] md:text-sm uppercase tracking-widest ml-2 transition-all">
              <span className="hidden xs:inline">Leave</span>
            </Link>

            {isHost && (
              <button 
                onClick={async () => {
                  if(window.confirm("Are you sure you want to completely end this class? This will close it for all students.")) {
                    await supabase.from('live_sessions').update({ status: 'ended' }).eq('id', sessionId);
                    navigate('/dashboard');
                  }
                }}
                className="px-4 md:px-6 h-10 md:h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 font-black text-[10px] md:text-sm uppercase tracking-widest ml-2 transition-all"
              >
                <PhoneOff size={14} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden xs:inline">End Class</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 md:gap-3 w-1/4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2.5 md:p-3 rounded-full transition-all ${isSidebarOpen ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 hover:bg-white/10 text-white'}`}
            >
              <MessageSquare size={18} />
            </button>
            <button className="p-2.5 md:p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all hidden md:flex">
              <Settings size={18} />
            </button>
          </div>
        </div>
    </div>
  );
};

const LiveClass = () => {
  const client = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  
  return (
    <AgoraRTCProvider client={client}>
      <LiveClassRoom />
    </AgoraRTCProvider>
  );
};

export default LiveClass;
