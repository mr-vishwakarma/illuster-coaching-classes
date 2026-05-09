import React from 'react';
import { 
  Mic, MicOff, Video, VideoOff, MonitorUp, 
  Hand, PhoneOff, MessageSquare, Settings 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LiveClassControlsProps {
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  isVideoOff: boolean;
  setIsVideoOff: (val: boolean) => void;
  isScreenSharing: boolean;
  toggleScreenShare: () => void;
  isHandRaised: boolean;
  toggleHandRaise: () => void;
  isHost: boolean;
  onEndClass: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (val: boolean) => void;
}

export const LiveClassControls: React.FC<LiveClassControlsProps> = ({
  isMuted, setIsMuted,
  isVideoOff, setIsVideoOff,
  isScreenSharing, toggleScreenShare,
  isHandRaised, toggleHandRaise,
  isHost, onEndClass,
  isSidebarOpen, setIsSidebarOpen
}) => {
  return (
    <div className="h-20 md:h-24 bg-[#111] border-t border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30 w-full">
      <div className="hidden md:flex items-center gap-4 w-1/4">
        <span className="text-sm font-black text-white/50 uppercase tracking-widest">
          System Design | {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
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
            onClick={onEndClass}
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
  );
};
