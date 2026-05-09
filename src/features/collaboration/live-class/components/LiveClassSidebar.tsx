import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, X, Send, MicOff, Mic, VideoOff, Video, Hand } from 'lucide-react';

interface LiveClassSidebarProps {
  activeTab: 'chat' | 'participants';
  setActiveTab: (tab: 'chat' | 'participants') => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
  messages: any[];
  chatMessage: string;
  setChatMessage: (val: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  participants: any[];
  user: any;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const LiveClassSidebar: React.FC<LiveClassSidebarProps> = ({
  activeTab, setActiveTab,
  isSidebarOpen, setIsSidebarOpen,
  messages, chatMessage, setChatMessage, handleSendMessage,
  participants, user, chatEndRef
}) => {
  return (
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
  );
};
