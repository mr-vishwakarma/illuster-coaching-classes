import { motion } from 'framer-motion';
import { Camera, ArrowLeft, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import TopperSwipeCarousel from '../../testimonials/components/TopperSwipeCarousel';
import StudentScrollReveal from '../components/StudentScrollReveal';
import SuccessBook from '../components/SuccessBook';

const Gallery = () => {
  const images = [
    { title: 'Classroom Interaction', category: 'Environment', icon: '🏫' },
    { title: 'Doubt Solving Session', category: 'Study', icon: '💡' },
    { title: 'Student Excellence Awards', category: 'Events', icon: '🏆' },
    { title: 'Modern Computer Lab', category: 'Facilities', icon: '💻' },
    { title: 'Physics Laboratory', category: 'Practical', icon: '🔬' },
    { title: 'Group Discussion', category: 'Co-learning', icon: '🤝' },
    { title: 'Annual Sports Meet', category: 'Events', icon: '⚽' },
    { title: 'Library Access', category: 'Resources', icon: '📚' },
    { title: 'Medical Prep Seminar', category: 'Seminars', icon: '🩺' },
  ];

  return (
    <div className="pt-32 md:pt-40 min-h-screen bg-[#050505] text-white">
      <div className="container mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/about" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to About
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-black tracking-tight leading-none">
              Life at <br />
              <span className="text-orange-500">Illuster.</span>
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 md:gap-4 text-white/40 font-medium"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center text-white/70 border border-white/10 shrink-0">
              <Camera size={20} className="md:w-6 md:h-6" />
            </div>
            <p className="max-w-[200px] text-sm md:text-base">A glimpse into our academic environment and vibrant culture.</p>
          </motion.div>
        </div>

        {/* 3D Success Book Section */}
        <section className="mb-24 md:mb-40">
          <SuccessBook />
        </section>

        {/* Toppers Section */}
        <section className="mb-20 md:mb-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-black uppercase tracking-widest mb-4">
              <Trophy size={14} /> Hall of Fame
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-display font-black text-white">Our Top Performers</h2>
            <p className="text-sm md:text-base lg:text-xl text-white/40 mt-3 md:mt-4 font-medium italic">Swipe to explore the minds that conquered the exams.</p>
          </div>
          <TopperSwipeCarousel />
        </section>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative aspect-[4/5] rounded-[1.5rem] md:rounded-[2.5rem] bg-[#0d0d0d] border border-white/5 overflow-hidden cursor-pointer"
            >
              {/* Image Placeholder with high-end aesthetic */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                 <div className="text-center group-hover:scale-110 transition-transform duration-700">
                    <div className="text-7xl mb-4 opacity-50 drop-shadow-2xl">{img.icon}</div>
                    <div className="w-12 h-1 bg-orange-500 mx-auto rounded-full group-hover:w-20 transition-all duration-500"></div>
                 </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity"></div>
              
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6 md:right-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-1 md:mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">{img.category}</p>
                <h4 className="text-lg md:text-xl font-bold text-white leading-tight">{img.title}</h4>
              </div>

              {/* Corner Glow */}
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-500/10 blur-[30px] rounded-full group-hover:bg-orange-500/20 transition-all"></div>
            </motion.div>
          ))}
        </div>

        {/* Student Scroll Reveal Section */}
        <section className="mt-24 md:mt-40">
           <StudentScrollReveal />
        </section>

        {/* Footer CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-24 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-r from-orange-600 to-orange-500 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 text-center md:text-left"
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-1 md:mb-2 tracking-tight">Inspired by our culture?</h3>
            <p className="text-white/80 font-medium italic">Join our next batch and start your journey to excellence.</p>
          </div>
          <Link to="/courses" className="px-6 py-3 md:px-8 md:py-4 bg-white text-black font-black rounded-xl md:rounded-2xl hover:bg-black hover:text-white transition-all shadow-xl text-sm md:text-base">
            View All Courses
          </Link>
        </motion.div>

      </div>
    </div>
  );
};

export default Gallery;
