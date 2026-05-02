import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Video, VideoOff, MonitorUp, 
  Hand, MessageSquare, Users, Settings, 
  PhoneOff, Send, MoreVertical, Maximize,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const LiveClass = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatMessage, setChatMessage] = useState('');

  // Mock chat messages
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Teacher', text: 'Welcome everyone! We will start in 2 minutes.', time: '10:00 AM', isTeacher: true },
    { id: 2, sender: 'Rahul Kumar', text: 'Good morning sir!', time: '10:01 AM', isTeacher: false },
    { id: 3, sender: 'Priya Singh', text: 'Morning everyone.', time: '10:01 AM', isTeacher: false },
  ]);

  // Mock participants
  const participants = [
    { id: 1, name: 'Alex Teacher', role: 'Host', isMuted: false, isVideoOff: false },
    { id: 2, name: 'You (Rahul Kumar)', role: 'Student', isMuted: isMuted, isVideoOff: isVideoOff },
    { id: 3, name: 'Priya Singh', role: 'Student', isMuted: true, isVideoOff: false },
    { id: 4, name: 'Amit Patel', role: 'Student', isMuted: true, isVideoOff: true },
    { id: 5, name: 'Neha Sharma', role: 'Student', isMuted: false, isVideoOff: true },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: 'You (Rahul Kumar)',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: false
    }]);
    setChatMessage('');
  };

  return (
    <div className="h-screen bg-[#0a0a0a] text-white flex flex-col font-sans pt-[72px]">
      
      {/* Header Info */}
      <div className="h-12 md:h-14 bg-[#111] border-b border-white/5 flex items-center justify-between px-3 md:px-6 shrink-0">
        <div className="flex items-center gap-2 md:gap-4 truncate">
          <div className="bg-red-500/20 text-red-500 px-2 py-0.5 md:px-3 md:py-1 rounded flex items-center gap-1 md:gap-2 text-[10px] md:text-xs font-black tracking-wider">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse"></div>
            LIVE
          </div>
          <h1 className="text-xs md:text-lg font-medium text-white/90 border-l border-white/10 pl-2 md:pl-4 truncate">
            {window.innerWidth < 768 ? "System Design" : "3.0 Job-Ready AI Powered Cohort - System Design Fundamentals"}
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-sm text-white/50">
          <span className="bg-white/5 px-2 py-0.5 md:px-3 md:py-1 rounded hidden sm:inline">Batch A</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-bold">10:02 AM</span>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Video Area */}
        <div className="flex-1 flex flex-col p-2 md:p-4 gap-2 md:gap-4 relative overflow-hidden">
          
          {/* Main Presenter / Screen Share */}
          <div className="flex-1 bg-[#111] rounded-xl md:rounded-2xl border border-white/5 overflow-hidden relative group">
            {/* Placeholder for Teacher Video/Screen */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a251a] to-[#0a0f0a]">
              <div className="text-center p-4">
                <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <span className="text-3xl md:text-5xl">👨‍🏫</span>
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-white/80">Teacher's Screen</h3>
                <p className="text-white/40 mt-1 md:mt-2 text-xs md:text-sm">System Design Architecture</p>
              </div>
            </div>

            {/* Video Overlays */}
            <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 bg-black/60 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-[10px] md:text-sm flex items-center gap-1.5 md:gap-2">
              <Mic size={12} className="text-green-400 md:w-3.5 md:h-3.5" />
              <span className="font-bold">Alex Teacher</span>
            </div>
            
            <button className="absolute top-3 right-3 md:top-4 md:right-4 p-1.5 md:p-2 bg-black/40 hover:bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize size={14} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>

          {/* Students Grid (Bottom strip) */}
          <div className="h-24 md:h-32 shrink-0 flex gap-2 md:gap-4 overflow-x-auto pb-1 scrollbar-hide">
            {[...participants].slice(1).map((p, idx) => (
              <div key={idx} className="w-32 md:w-48 h-full bg-[#111] rounded-lg md:rounded-xl border border-white/5 shrink-0 relative overflow-hidden">
                {p.isVideoOff ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a]">
                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center text-xs md:text-xl font-bold text-white/30">
                      {p.name.charAt(0)}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a2a2a] to-[#1a1a1a] flex items-center justify-center">
                     <span className="text-xl md:text-3xl opacity-50">👤</span>
                  </div>
                )}
                <div className="absolute bottom-1.5 left-1.5 right-1.5 flex justify-between items-center">
                  <div className="bg-black/60 backdrop-blur text-[8px] md:text-[10px] px-1.5 py-0.5 rounded truncate max-w-[80px] md:max-w-[100px] font-bold">
                    {p.name}
                  </div>
                  {p.isMuted && (
                    <div className="bg-red-500/80 p-0.5 md:p-1 rounded-full">
                      <MicOff size={8} className="md:w-2.5 md:h-2.5" />
                    </div>
                  )}
                </div>
              </div>
            ))}
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
              {/* Mobile Close Button */}
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute -left-10 top-2 p-2 bg-[#111] border border-white/5 rounded-full md:hidden text-white/50"
              >
                <X size={20} />
              </button>
              {/* Sidebar Tabs */}
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

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                
                {activeTab === 'chat' ? (
                  <>
                    <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                      {messages.map(msg => (
                        <div key={msg.id} className={`flex flex-col ${msg.sender.includes('You') ? 'items-end' : 'items-start'}`}>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-xs font-medium text-white/70">{msg.sender}</span>
                            {msg.isTeacher && <span className="bg-green-500/20 text-green-400 text-[9px] px-1.5 py-0.5 rounded font-bold">HOST</span>}
                            <span className="text-[10px] text-white/30">{msg.time}</span>
                          </div>
                          <div className={`px-4 py-2 rounded-2xl text-sm ${msg.sender.includes('You') ? 'bg-green-600 rounded-tr-sm' : 'bg-white/10 rounded-tl-sm'}`}>
                            {msg.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Chat Input */}
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
                            {p.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white/90">{p.name}</span>
                            <span className="text-[10px] text-white/40">{p.role}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-white/40">
                          {p.isMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} />}
                          {p.isVideoOff ? <VideoOff size={14} className="text-red-400" /> : <Video size={14} />}
                          {p.role === 'Host' && <MoreVertical size={14} className="cursor-pointer hover:text-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </motion.div>
          )}
        </AnimatePresence>

       {/* Control Bar (Bottom) */}
      <div className="h-20 md:h-24 bg-[#111] border-t border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-20">
        
        {/* Left Stats - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4 w-1/4">
          <span className="text-sm font-black text-white/50 uppercase tracking-widest">System Design | 10:02 AM</span>
        </div>

        {/* Center Controls */}
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
          
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all hidden sm:flex">
            <MonitorUp size={18} />
          </button>
          
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all">
            <Hand size={18} />
          </button>

          <Link to="/dashboard" className="px-4 md:px-6 h-10 md:h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2 font-black text-[10px] md:text-sm uppercase tracking-widest ml-2 transition-all">
            <PhoneOff size={14} className="md:w-[18px] md:h-[18px]" />
            <span className="hidden xs:inline">Leave</span>
          </Link>
        </div>

        {/* Right Controls */}
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

    </div>
  );
};

export default LiveClass;
