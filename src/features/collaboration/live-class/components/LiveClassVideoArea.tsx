import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, Maximize } from 'lucide-react';
import { RemoteUser } from "agora-rtc-react";

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

interface LiveClassVideoAreaProps {
  isHost: boolean;
  isScreenSharing: boolean;
  screenTrack: any;
  localCameraTrack: any;
  isVideoOff: boolean;
  teacherVideoTrack: any;
  remoteVideoRef: React.RefObject<HTMLDivElement | null>;
  sessionInfo: any;
  user: any;
  remoteUsers: any[];
  participants: any[];
}

export const LiveClassVideoArea: React.FC<LiveClassVideoAreaProps> = ({
  isHost, isScreenSharing, screenTrack, localCameraTrack, isVideoOff,
  teacherVideoTrack, remoteVideoRef, sessionInfo, user, remoteUsers, participants
}) => {
  return (
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

      {/* Participants Strip */}
      <div className="h-24 md:h-32 shrink-0 flex gap-2 md:gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {isHost && localCameraTrack && !isVideoOff && (
          <div className="w-32 md:w-48 h-full bg-[#111] rounded-lg md:rounded-xl border border-white/10 shrink-0 relative overflow-hidden">
            <VideoPlayer track={localCameraTrack} />
            <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-[8px] md:text-[9px] px-1.5 py-0.5 rounded font-bold">
              You
            </div>
          </div>
        )}
        {remoteUsers.map((remoteUser: any) => (
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
  );
};
