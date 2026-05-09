import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '../data';

const TestimonialCarousel3D = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[480px] md:h-[550px] w-full flex items-center justify-center overflow-hidden perspective-1000">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[250px] md:h-[300px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        <AnimatePresence mode="popLayout">
          {[-1, 0, 1].map((offset) => {
            const itemIndex = (index + offset + testimonials.length) % testimonials.length;
            const item = testimonials[itemIndex];
            
            // Handle mobile transforms
            const mobileX = offset * 260; // Tighter offset on mobile
            const desktopX = offset * 350;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.8, x: offset === 0 ? 0 : (window.innerWidth < 768 ? mobileX : desktopX), rotateY: offset * 45 }}
                animate={{
                  opacity: offset === 0 ? 1 : 0.3,
                  scale: offset === 0 ? 1 : 0.75,
                  x: window.innerWidth < 768 ? mobileX : desktopX,
                  rotateY: offset * -25,
                  zIndex: offset === 0 ? 10 : 5,
                }}
                exit={{ opacity: 0, scale: 0.5, x: offset * 500 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-[250px] sm:w-[320px] md:w-[450px]"
              >
                <div className={`p-5 md:p-12 rounded-2xl md:rounded-[2.5rem] border ${offset === 0 ? 'bg-[#0d0d0d] border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] md:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]' : 'bg-[#080808] border-white/5 shadow-none'} backdrop-blur-xl relative group`}>
                  
                  {/* Quote Icon */}
                  <div className="absolute -top-3 -left-3 md:-top-6 md:-left-6 w-10 h-10 md:w-16 md:h-16 bg-orange-500 rounded-lg md:rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-orange-500/20 group-hover:rotate-12 transition-transform">
                    <Quote size={20} className="md:w-8 md:h-8" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-3 md:mb-8">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} size={12} fill="#F97316" className="text-orange-500 md:w-4 md:h-4" />
                    ))}
                  </div>

                  <p className="text-sm md:text-2xl font-medium leading-relaxed mb-4 md:mb-10 text-white/90 italic line-clamp-4 md:line-clamp-none">
                    "{item.text}"
                  </p>

                  <div className="flex items-center gap-2.5 md:gap-5 mt-auto">
                    <div className="w-9 h-9 md:w-14 md:h-14 rounded-lg md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs md:text-xl text-orange-500">
                      {item.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs md:text-lg font-black text-white">{item.name}</h4>
                      <p className="text-[9px] md:text-xs font-black uppercase tracking-[0.2em] text-white/40 mt-0.5 md:mt-1">{item.rank} • {item.exam}</p>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 p-4 md:p-8 text-white/5 text-6xl md:text-8xl font-display font-black select-none pointer-events-none">
                    "
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 md:gap-12 z-30 scale-90 md:scale-100">
        <button 
          onClick={prev}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>
        <div className="flex gap-1.5 md:gap-2">
          {testimonials.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-6 md:w-8 bg-orange-500' : 'w-1.5 md:w-2 bg-white/20'}`}
            ></div>
          ))}
        </div>
        <button 
          onClick={next}
          className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
        >
          <ChevronRight size={20} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialCarousel3D;
