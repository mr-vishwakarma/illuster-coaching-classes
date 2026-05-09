import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../../shared/lib/supabase';
import { useAuth } from '../../../../shared/context/AuthContext';
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
} from "agora-rtc-react";

// Sub-components
import { LiveClassHeader } from '../components/LiveClassHeader';
import { LiveClassControls } from '../components/LiveClassControls';
import { LiveClassSidebar } from '../components/LiveClassSidebar';
import { LiveClassVideoArea } from '../components/LiveClassVideoArea';

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
      .then(({ data }: any) => {
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
  const [agoraToken, setAgoraToken] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    if (!user?.id || !sessionId) return;
    const fetchToken = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('agora-token', {
          body: { channelName: sessionId, uid: user.id }
        });
        if (!error && data?.token) {
          setAgoraToken(data.token);
        } else {
          setAgoraToken(null);
        }
      } catch {
        setAgoraToken(null);
      } finally {
        setIsJoined(true);
      }
    };
    fetchToken();
  }, [user?.id, sessionId]);
  
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
    token: agoraToken,
    uid: user?.id
  }, isJoined);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const { videoTracks: remoteVideoTracks } = useRemoteVideoTracks(remoteUsers);
  const teacherVideoTrack = remoteVideoTracks[0] ?? null;
  const isHost = ['admin', 'tutor'].includes(user?.role?.toLowerCase() || '');

  useEffect(() => {
    audioTracks.forEach(track => track.play());
  }, [audioTracks]);

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

  useEffect(() => {
    if (!sessionId || isHost) return;
    const endWatcher = supabase
      .channel(`end-watch-${sessionId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'live_sessions', filter: `id=eq.${sessionId}` },
        (payload: any) => {
          if (payload.new.status === 'ended') {
            toast.info('The class has ended. Redirecting to dashboard...', { icon: () => <span>📚</span> });
            setTimeout(() => navigate('/dashboard'), 2500);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(endWatcher); };
  }, [sessionId, isHost, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchMessages();
    const chatChannel = supabase
      .channel('live-chat')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'live_messages', filter: `session_id=eq.${sessionId}` },
        (payload: any) => {
          setMessages(prev => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    const presenceChannel = supabase.channel(`room-${sessionId}`, {
      config: { presence: { key: user.id } },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const activeParticipants = Object.values(state).map((presences: any) => presences[0]);
        setParticipants(activeParticipants);
      })
      .subscribe(async (status: any) => {
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

  useEffect(() => {
    if (roomChannel && user) {
      roomChannel.track({
        id: user.id,
        name: user.name,
        role: user.role === 'student' ? 'Student' : 'Host',
        isMuted, isVideoOff, isHandRaised,
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
      toast.info("Your hand is raised!", { icon: () => <span>✋</span>, position: "bottom-center" });
    }
  };

  const handleEndClass = async () => {
    if(window.confirm("Are you sure you want to completely end this class?")) {
      await supabase.from('live_sessions').update({ status: 'ended' }).eq('id', sessionId);
      navigate('/dashboard');
    }
  };

  return (
    <div className="h-[100dvh] bg-[#0a0a0a] text-white flex flex-col font-sans overflow-hidden">
      <LiveClassHeader sessionInfo={sessionInfo} />
      
      <div className="flex-1 flex overflow-hidden">
        <LiveClassVideoArea 
          isHost={isHost}
          isScreenSharing={isScreenSharing}
          screenTrack={screenTrack}
          localCameraTrack={localCameraTrack}
          isVideoOff={isVideoOff}
          teacherVideoTrack={teacherVideoTrack}
          remoteVideoRef={remoteVideoRef}
          sessionInfo={sessionInfo}
          user={user}
          remoteUsers={remoteUsers}
          participants={participants}
        />

        <LiveClassSidebar 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          messages={messages}
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          handleSendMessage={handleSendMessage}
          participants={participants}
          user={user}
          chatEndRef={chatEndRef}
        />
      </div>

      <LiveClassControls 
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isVideoOff={isVideoOff}
        setIsVideoOff={setIsVideoOff}
        isScreenSharing={isScreenSharing}
        toggleScreenShare={toggleScreenShare}
        isHandRaised={isHandRaised}
        toggleHandRaise={toggleHandRaise}
        isHost={isHost}
        onEndClass={handleEndClass}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
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
