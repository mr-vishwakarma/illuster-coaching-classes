import { Link } from 'react-router-dom';
import { Video, ChevronRight } from 'lucide-react';

export const LiveBanner = ({ session }: { session: any }) => (
  <Link
    to={`/live-class/${session.id}`}
    className="group flex items-center justify-between px-4 md:px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:from-red-500 hover:to-red-400 transition-all"
  >
    <div className="flex items-center gap-3">
      <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5 shrink-0 border border-white/20">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live Now
      </span>
      <span className="font-semibold text-sm truncate">
        <span className="opacity-70">{session.profiles?.full_name || 'Your Tutor'}:</span>{' '}
        <span className="font-bold">{session.title}</span>
        <span className="hidden sm:inline opacity-70"> · {session.batch}</span>
      </span>
    </div>
    <span className="shrink-0 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors ml-4">
      <Video size={12} /> Join <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
    </span>
  </Link>
);
