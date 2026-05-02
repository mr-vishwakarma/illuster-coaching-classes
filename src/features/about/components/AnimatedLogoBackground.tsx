import { motion } from 'framer-motion';

const AnimatedLogoBackground = () => {
  return (
    <div className="relative w-full py-20 flex items-center justify-center bg-black overflow-hidden select-none">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-orange-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center"
      >
        <h1 
          className="text-7xl md:text-[10rem] lg:text-[14rem] font-display font-black tracking-tighter leading-none"
          style={{
            background: 'linear-gradient(90deg, #000, #F97316, #000, #EA580C, #000)',
            backgroundSize: '400% 100%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'gradientMove 8s linear infinite',
            filter: 'drop-shadow(0 0 15px rgba(249, 115, 22, 0.1))',
            textShadow: '0 0 1px rgba(255,255,255,0.05)'
          }}
        >
          ILLUSTER
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-xl md:text-3xl font-display font-black text-white tracking-[0.5em] mt-[-2rem] md:mt-[-4rem] uppercase"
        >
          Coaching Classes
        </motion.p>
      </motion.div>

      {/* CSS Animation Keyframes */}
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 100% 0%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </div>
  );
};

export default AnimatedLogoBackground;
