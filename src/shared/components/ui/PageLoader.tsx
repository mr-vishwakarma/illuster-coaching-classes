import { motion } from 'framer-motion';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]">
      {/* Ambient glow */}
      <div className="absolute w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse" />

      <div className="relative flex flex-col items-center gap-6">
        {/* Logo pulse */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          <motion.img
            src="/logo.png"
            alt="Illuster"
            className="h-14 w-auto object-contain"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>

        {/* Shimmer bar */}
        <div className="relative w-48 h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-orange-500/60 to-transparent rounded-full"
            animate={{ x: ['-100%', '400%'] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Subtle text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-white/30 text-xs tracking-[0.3em] uppercase font-medium"
        >
          Loading
        </motion.p>
      </div>
    </div>
  );
};

export default PageLoader;
