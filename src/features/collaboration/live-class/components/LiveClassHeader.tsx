import React from 'react';

interface LiveClassHeaderProps {
  sessionInfo: { title: string; batch: string; tutor_name: string } | null;
}

export const LiveClassHeader: React.FC<LiveClassHeaderProps> = ({ sessionInfo }) => {
  return (
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
  );
};
