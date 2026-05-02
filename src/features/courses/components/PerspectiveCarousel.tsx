import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, PlayCircle } from 'lucide-react';

const carouselItems = [
  {
    id: 1,
    icon: <Users size={32} className="text-white" />,
    title: "Top 1% Faculty",
    description: "Learn from IITians, NITians, and doctors who have cracked the very exams you're preparing for.",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    icon: <BookOpen size={32} className="text-white" />,
    title: "Structured Curriculum",
    description: "Meticulously designed syllabus coverage with integrated doubt-solving and periodic assessments.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    icon: <PlayCircle size={32} className="text-white" />,
    title: "Smart Portal Access",
    description: "Never miss a class. Access recorded lectures, PDF notes, and analytics on your personal dashboard.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
  }
];

const PerspectiveCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto h-[400px] flex items-center justify-center overflow-hidden [perspective:1000px]">
      
      {/* Navigation Buttons */}
      <div className="absolute top-1/2 left-4 z-50 transform -translate-y-1/2">
        <button onClick={handlePrev} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>
      <div className="absolute top-1/2 right-4 z-50 transform -translate-y-1/2">
        <button onClick={handleNext} className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>

      <div className="relative w-[350px] h-[300px] flex justify-center items-center [transform-style:preserve-3d]">
        <AnimatePresence initial={false}>
          {carouselItems.map((item, index) => {
            // Calculate relative position based on active index
            const isCenter = index === activeIndex;
            const isLeft = index === (activeIndex - 1 + carouselItems.length) % carouselItems.length;
            const isRight = index === (activeIndex + 1) % carouselItems.length;
            
            // Determine visibility and styles
            let x = 0;
            let z = 0;
            let rotateY = 0;
            let opacity = 0;
            let zIndex = 0;

            if (isCenter) {
              x = 0;
              z = 100;
              rotateY = 0;
              opacity = 1;
              zIndex = 30;
            } else if (isLeft) {
              x = -200;
              z = -100;
              rotateY = 30; // Inverted perspective (rotate outwards)
              opacity = 0.5;
              zIndex = 20;
            } else if (isRight) {
              x = 200;
              z = -100;
              rotateY = -30; // Inverted perspective
              opacity = 0.5;
              zIndex = 20;
            }

            // Only render adjacent and center items
            if (!isCenter && !isLeft && !isRight) return null;

            return (
              <motion.div
                key={item.id}
                className="absolute w-[350px] h-[300px] rounded-2xl overflow-hidden flex flex-col items-center justify-end text-center shadow-2xl cursor-pointer group"
                animate={{
                  x: x,
                  z: z,
                  rotateY: rotateY,
                  opacity: opacity,
                  scale: isCenter ? 1 : 0.85
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.32, 0.72, 0, 1] // Custom smooth bezier
                }}
                style={{ zIndex }}
                onClick={() => setActiveIndex(index)}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

                {/* Content */}
                <div className="relative z-10 p-6 flex flex-col items-center">
                  <div className="mb-4 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-300 line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Pagination Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {carouselItems.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`w-2 h-2 rounded-full transition-all ${idx === activeIndex ? 'bg-accent-orange w-6' : 'bg-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PerspectiveCarousel;
