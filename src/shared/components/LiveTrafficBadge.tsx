import { useTraffic } from '../context/TrafficContext';
import { Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveTrafficBadge = () => {
  const { activeUsers } = useTraffic();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="fixed bottom-24 lg:bottom-6 right-6 z-[60]"
      >
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2.5 rounded-2xl shadow-2xl shadow-black/50 group hover:border-[#8a76ff]/50 transition-all duration-300">
          {/* Pulsing Dot Indicator */}
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users size={14} className="text-white/40 group-hover:text-[#8a76ff] transition-colors" />
            <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/70">
              <span className="text-white font-bold text-sm mr-1">{activeUsers}</span>
              Live <span className="hidden sm:inline">Students</span>
            </span>
          </div>
          
          {/* Subtle Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LiveTrafficBadge;
