import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const teamMembers = [
  {
    id: 1,
    name: "Ashish Solanki",
    role: "Founder & Chairman",
    image: "/images/team/founder.png",
    bio: "Ashish Solanki has over 20 years of experience in the education sector. He founded Illuster with a vision to provide high-quality, accessible coaching for competitive exams. His leadership has guided thousands of students to success in JEE and NEET.",
    highlights: ["PhD in Physics", "20+ Years Experience", "Visionary Leader"]
  },
  {
    id: 2,
    name: "Abhishek Soni",
    role: "Managing Director",
    image: "/images/team/director.png",
    bio: "Abhishek Soni oversees the strategic direction and operations at Illuster. With a background in management and a passion for education, she ensures that our students receive the best resources and support to excel in their academic journeys.",
    highlights: ["MBA from IIM", "Operational Excellence", "Student-Centric Approach"]
  },
  {
    id: 3,
    name: "Rahul Sharma",
    role: "Co-Founder & CTO",
    image: "/images/team/cofounder.png",
    bio: "Rahul Sharma is the tech visionary behind Illuster's digital platform. He leads our technology team to create innovative learning tools, including our interactive live classes and AI-driven assessment systems.",
    highlights: ["Tech Innovator", "Full Stack Developer", "AI Enthusiast"]
  },
  {
    id: 4,
    name: "Prof. Amit Verma",
    role: "Academic Head",
    image: "/images/team/academic_head.png",
    bio: "Prof. Amit Verma leads our academic department, ensuring that our curriculum is up-to-date and effective. He works closely with our mentors to deliver high-quality instruction and support to every student.",
    highlights: ["M.Tech from IIT", "Curriculum Specialist", "Expert Mentor"]
  }
];

const TeamShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMember = teamMembers[currentIndex];

  const nextMember = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black to-[#050505] overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-[600px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[600px]">
          
          {/* Left Content */}
          <div className="flex-1 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMember.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="max-w-2xl"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-px bg-orange-500"></div>
                  <span className="text-orange-500 font-black uppercase tracking-[0.3em] text-xs md:text-sm">Management Team</span>
                </div>
                
                <h2 className="text-5xl md:text-7xl font-display font-black text-white mb-4 tracking-tighter">
                  {currentMember.name}
                </h2>
                
                <h3 className="text-xl md:text-2xl font-bold text-white/60 mb-8 italic">
                  {currentMember.role}
                </h3>
                
                <p className="text-lg md:text-xl text-white/40 leading-relaxed font-medium mb-10 max-w-xl">
                  {currentMember.bio}
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  {currentMember.highlights.map((h, i) => (
                    <div key={i} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs md:text-sm font-bold uppercase tracking-widest">
                      {h}
                    </div>
                  ))}
                </div>

                {/* Navigation Controls */}
                <div className="flex items-center gap-6">
                  <button 
                    onClick={prevMember}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group"
                  >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={nextMember}
                    className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group"
                  >
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <div className="h-px bg-white/10 flex-1 ml-4 hidden md:block"></div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Image */}
          <div className="flex-1 order-1 lg:order-2 relative group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMember.id}
                initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: -5 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full aspect-[4/5] rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl"
              >
                <img 
                  src={currentMember.image} 
                  alt={currentMember.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </motion.div>
            </AnimatePresence>

            {/* Decorative shape behind image */}
            <div className="absolute -top-10 -right-10 w-full h-full bg-orange-500/10 rounded-[4rem] -z-0 blur-3xl group-hover:bg-orange-500/20 transition-all duration-500"></div>
          </div>

        </div>

        {/* Bottom Thumbnail Bar (Glassmorphism) */}
        <div className="mt-20 md:mt-32 p-4 md:p-6 rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide max-w-5xl mx-auto">
          {teamMembers.map((member, index) => (
            <button
              key={member.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex items-center gap-4 px-4 py-2 rounded-2xl transition-all shrink-0 ${currentIndex === index ? 'bg-white/10 border border-white/20' : 'opacity-40 hover:opacity-100'}`}
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white/10">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale" />
              </div>
              <div className="text-left hidden sm:block">
                <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-widest">{member.name}</h4>
                <p className="text-[10px] md:text-xs text-white/40 font-bold italic">{member.role}</p>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TeamShowcase;
