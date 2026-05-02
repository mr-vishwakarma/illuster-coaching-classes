import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const students = [
  { id: '001', name: 'Ishita Verma', score: '99.5%', color: '#FB923C' },
  { id: '002', name: 'Kabir Singh', score: '98.9%', color: '#38BDF8' },
  { id: '003', name: 'Meera Reddy', score: '99.2%', color: '#4ADE80' },
  { id: '004', name: 'Rohan Mehra', score: '97.5%', color: '#F472B6' },
  { id: '005', name: 'Sanya Gupta', score: '99.9%', color: '#818CF8' },
];

const StudentScrollReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div ref={containerRef} className="py-32 bg-[#050505]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-24 text-center">
          Our Growing <span className="text-orange-500 italic">Community.</span>
        </h2>
        
        <div className="flex flex-col gap-32">
          {students.map((student, idx) => (
            <RevealItem key={student.id} student={student} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

const RevealItem = ({ student, index }: any) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });

  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [0.8, 1]), { stiffness: 100, damping: 20 });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

  return (
    <motion.div 
      ref={ref}
      style={{ scale, opacity, y }}
      className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}
    >
      {/* Image / Portrait Placeholder */}
      <div className="relative w-full max-w-md aspect-[4/5] rounded-[3rem] overflow-hidden bg-[#0d0d0d] border border-white/10 group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[12rem] font-display font-black text-white/5 select-none transition-transform duration-700 group-hover:scale-110">
            {student.id}
          </div>
        </div>
        
        {/* Glow effect */}
        <div 
          className="absolute -bottom-20 -right-20 w-64 h-64 blur-[80px] rounded-full opacity-20"
          style={{ backgroundColor: student.color }}
        ></div>
      </div>

      {/* Text Info */}
      <div className="flex-1 text-center md:text-left">
        <span className="text-6xl md:text-8xl font-display font-black text-white/10 mb-4 block leading-none">
          {student.id}
        </span>
        <h3 className="text-4xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">
          {student.name}
        </h3>
        <p className="text-xl text-white/40 font-medium mb-8 max-w-md">
          Part of our elite intensive cohort. Achieving consistent growth and academic excellence in all mock assessments.
        </p>
        <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 rounded-2xl border border-white/10">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-black text-white">{student.score} SCORE</span>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentScrollReveal;
