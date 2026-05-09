import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  targetClass: string;
  badge?: string;
  icon: string;
  color: string;
  rating: number;
}

interface CourseCardStackProps {
  courses: Course[];
}

const CourseCardStack = ({ courses }: CourseCardStackProps) => {
  const [cards, setCards] = useState(courses);

  const handleNext = () => {
    setCards((prev) => {
      const newArray = [...prev];
      const first = newArray.shift();
      if (first) newArray.push(first);
      return newArray;
    });
  };

  return (
    <div className="relative w-full max-w-sm mx-auto h-[500px] flex justify-center items-center perspective-1000">
      <AnimatePresence>
        {cards.map((course, index) => {
          const isTop = index === 0;
          
          return (
            <motion.div
              key={course.id}
              className="absolute w-full h-[450px] card flex flex-col p-8 cursor-grab active:cursor-grabbing"
              style={{
                transformOrigin: "top center",
              }}
              initial={false}
              animate={{
                top: index * 20,
                scale: 1 - index * 0.05,
                zIndex: courses.length - index,
                opacity: index < 3 ? 1 : 0,
                rotateX: index * 5,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 1
              }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(_, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -10000 || swipe > 10000 || Math.abs(offset.x) > 100) {
                  handleNext();
                }
              }}
            >
              <div className="border-b border-[var(--border-light)] pb-4 flex justify-between items-start mb-6">
                <span className="badge bg-primary/10 text-primary">
                  {course.targetClass}
                </span>
                {course.badge && (
                  <span className="badge bg-accent-orange/10 text-accent-orange">
                    {course.badge}
                  </span>
                )}
              </div>
              
              <div className="flex-grow flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-inner" 
                    style={{ color: course.color }}
                  >
                    {course.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{course.title}</h3>
                    <div className="flex items-center gap-1 text-sm font-bold text-accent-orange mt-1">
                      <Star size={14} fill="currentColor" /> {course.rating}
                    </div>
                  </div>
                </div>
                
                <p className="text-[var(--text-muted)] line-clamp-4 leading-relaxed mb-6">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-[var(--border-light)] mt-auto">
                  <div>
                    <span className="text-2xl font-black text-[var(--text-main)]">₹{(course.price || 0).toLocaleString('en-IN')}</span>
                    <span className="text-sm text-[var(--text-light)] line-through ml-2">₹{(course.originalPrice || 0).toLocaleString('en-IN')}</span>
                  </div>
                  {isTop && (
                    <Link to={`/courses/${course.id}`} className="p-3 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-md">
                      <ArrowRight size={20} />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <div className="absolute -bottom-16 flex gap-4">
        <button 
          onClick={handleNext}
          className="px-6 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors backdrop-blur-md text-sm font-medium tracking-wide flex items-center gap-2"
        >
          Next Course <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default CourseCardStack;
