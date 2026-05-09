import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from 'lenis';

interface SienaParallaxProps {
  imageSrc: string;
  title: string;
  subtitle: string;
}

const SienaParallax: React.FC<SienaParallaxProps> = ({ imageSrc, title, subtitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Scale down the image slightly as we scroll past it
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  
  // Parallax the text up
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  
  // Fade out text as we scroll past
  const opacity = useTransform(scrollYProgress, [0.3, 0.6, 1], [1, 1, 0]);

  useEffect(() => {
    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="relative h-[120vh] w-full overflow-hidden flex items-center justify-center bg-black"
    >
      {/* Background Image with Parallax Scale */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={imageSrc} 
          alt="Parallax Background" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Cinematic Text Overlay */}
      <motion.div 
        className="relative z-20 text-center px-6 max-w-4xl"
        style={{ y, opacity }}
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-white mb-6 uppercase tracking-widest">
          {title}
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto">
          {subtitle}
        </p>
        
        {/* Play Button Overlay Element */}
        <div className="mt-12 inline-flex items-center justify-center w-20 h-20 rounded-full border border-white/30 backdrop-blur-md cursor-pointer hover:bg-white/10 transition-colors group">
          <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-2 group-hover:scale-110 transition-transform" />
        </div>
      </motion.div>
      
      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />
    </div>
  );
};

export default SienaParallax;
