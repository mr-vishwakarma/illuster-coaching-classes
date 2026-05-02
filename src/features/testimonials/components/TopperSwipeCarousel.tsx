import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

const toppers = [
  { id: 1, name: 'AARAV KAPOOR', rank: '01', exam: 'JEE ADVANCED', color: '#111', img: '👤' },
  { id: 2, name: 'SNEHA PATEL', rank: '02', exam: 'NEET TOPPER', color: '#222', img: '👤' },
  { id: 3, name: 'ROHAN GUPTA', rank: '03', exam: 'MATH OLYMPIAD', color: '#000', img: '👤' },
  { id: 4, name: 'ANANYA DESAI', rank: '04', exam: 'JEE MAIN 100%', color: '#1a1a1a', img: '👤' },
];

const TopperSwipeCarousel = () => {
  const [cards, setCards] = useState(toppers);

  const removeCard = (id: number) => {
    setCards((prev) => {
      const newCards = prev.filter((card) => card.id !== id);
      // Logic to move the swiped card to the bottom of the stack for infinity loop
      const swipedCard = prev.find(c => c.id === id);
      if (swipedCard) {
        return [swipedCard, ...newCards];
      }
      return newCards;
    });
  };

  return (
    <div className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center perspective-1000">
      <AnimatePresence>
        {cards.map((topper, index) => (
          <Card 
            key={topper.id} 
            topper={topper} 
            index={index} 
            total={cards.length}
            onSwipe={() => removeCard(topper.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

const Card = ({ topper, index, total, onSwipe }: any) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const isFront = index === total - 1;

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe();
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        opacity,
        zIndex: index,
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ 
        scale: 1 - (total - 1 - index) * 0.04, 
        y: (total - 1 - index) * (window.innerWidth < 768 ? -10 : -15),
        rotateZ: (total - 1 - index) * (index % 2 === 0 ? 1 : -1),
        opacity: 1 
      }}
      exit={{ 
        x: x.get() > 0 ? 800 : -800, 
        opacity: 0, 
        scale: 0.5,
        rotate: x.get() > 0 ? 45 : -45,
        transition: { duration: 0.4, ease: "easeIn" }
      }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      className={`absolute w-[260px] sm:w-[320px] md:w-[380px] aspect-[4/5] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 cursor-grab active:cursor-grabbing bg-black`}
    >
      {/* Visual Background */}
      <div className="absolute inset-0 bg-[#1a1a1a]">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <span className="text-[14rem] md:text-[20rem] font-black select-none">{topper.img}</span>
        </div>
      </div>

      {/* Typography Overlay */}
      <div className="relative z-20 h-full p-6 md:p-10 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
             {Array(3).fill(0).map((_, i) => (
               <p key={i} className="text-[6px] md:text-[8px] font-black tracking-[0.3em] text-white/30 uppercase leading-none">
                 FOREVER DREAMING <br /> YOUNGS
               </p>
             ))}
          </div>
          <span className="text-2xl md:text-4xl font-display font-black text-white/10">{topper.rank}</span>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="space-y-1 md:space-y-2">
            <h3 className="text-4xl md:text-6xl font-display font-black leading-[0.8] tracking-tighter text-white">
              {topper.name.split(' ')[0]}<br />
              <span className="text-orange-500">{topper.name.split(' ')[1]}</span>
            </h3>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
             <div className="h-px flex-1 bg-white/20"></div>
             <p className="text-[8px] md:text-[10px] font-black tracking-[0.4em] text-white/50">{topper.exam}</p>
          </div>
        </div>
      </div>

      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </motion.div>
  );
};

export default TopperSwipeCarousel;
