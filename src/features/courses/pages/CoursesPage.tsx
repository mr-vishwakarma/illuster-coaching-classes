import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { courses } from '../';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Class 11 & 12', 'Class 10', 'Class 8'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || course.targetClass === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="pt-32 md:pt-40 bg-[var(--bg-main)] min-h-screen">
      {/* Header */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border-light)] py-20 md:py-24">
        <div className="container mx-auto px-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6 leading-tight"
          >
            Explore Our <br/>Expert-Led Programs
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base md:text-xl text-[var(--text-muted)] max-w-3xl leading-relaxed"
          >
            Find the perfect program tailored to your academic goals. From foundational basics to competitive exam mastery, our curriculum is designed for results.
          </motion.p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="container mx-auto px-6 py-12 md:py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row gap-8 justify-between items-center mb-16"
        >
          <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
            {filters.map(filter => (
              <button
                key={filter}
                className={`px-4 md:px-8 py-2 md:py-3 rounded-full text-[10px] md:text-sm font-bold transition-all whitespace-nowrap border-2 ${
                  activeFilter === filter 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-[var(--bg-card)] border-[var(--border-light)] text-[var(--text-muted)] hover:border-primary hover:text-primary'
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xl group">
            <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-light)] group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-12 md:pl-14 pr-4 md:pr-6 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-[var(--border-light)] bg-[var(--bg-card)] text-[var(--text-main)] focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm md:text-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </motion.div>

        {/* Course Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-12"
        >
          <AnimatePresence mode='popLayout'>
            {filteredCourses.map(course => (
              <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative h-full rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden transition-all duration-300 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] flex flex-col"
              >
                {/* macOS style dots */}
                <div className="absolute top-4 left-4 flex gap-1.5 z-20">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                </div>

                {/* LIVE Badge */}
                <div className="absolute top-4 right-4 z-20 bg-white px-3 py-1 rounded shadow-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-red-500 font-bold text-xs">LIVE</span>
                </div>

                {/* Orange Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"></div>

                {/* Image Section */}
                <div className="w-full h-32 sm:h-48 md:h-56 bg-slate-900 relative overflow-hidden z-10 p-4 md:p-6 flex flex-col items-center justify-center border-b border-white/5">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                   <div className="w-12 h-12 md:w-20 md:h-20 rounded-full bg-white/10 flex items-center justify-center text-xl md:text-4xl relative z-20 shadow-2xl" style={{ color: course.color }}>
                     {course.icon}
                   </div>
                </div>

                <div className="p-5 md:p-6 flex-grow flex flex-col relative z-10">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 md:gap-2 mb-2 md:mb-4">
                    <span className="px-2 py-1 md:px-4 md:py-1.5 rounded-full border border-white/20 text-white/70 text-[8px] md:text-xs font-medium bg-white/5">
                      {course.targetClass}
                    </span>
                    {course.badge && (
                      <span className="px-2 py-1 md:px-4 md:py-1.5 rounded-full border border-white/20 text-white/70 text-[8px] md:text-xs font-medium bg-white/5">
                        {course.badge}
                      </span>
                    )}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-sm sm:text-lg md:text-2xl font-display font-medium text-white mb-3 md:mb-6 leading-tight group-hover:text-orange-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <div className="mt-auto">
                    {/* Pricing */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 md:mb-6 gap-1 sm:gap-2">
                      <div className="flex items-baseline gap-1.5 md:gap-2">
                        <span className="text-white text-[10px] md:text-lg">Price</span>
                        <span className="text-orange-500 text-sm sm:text-xl md:text-3xl font-bold">₹{(course.price || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white/40 text-[8px] md:text-sm line-through">₹{(course.originalPrice || 0).toLocaleString('en-IN')}</span>
                        <span className="bg-white text-black text-[7px] md:text-[10px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded">
                          {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link to={`/courses/${course.id}`} className="inline-flex items-center justify-between gap-1.5 md:gap-3 px-3 py-2 md:px-6 md:py-3 rounded-lg md:rounded-xl border border-white/30 text-white font-medium hover:bg-white hover:text-black transition-all text-[10px] md:text-base">
                      Enroll <span>→</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredCourses.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <div className="text-6xl mb-8 opacity-50">🔭</div>
            <h3 className="text-3xl font-black text-[var(--text-main)] mb-4">No Courses Found</h3>
            <p className="text-xl text-[var(--text-muted)] max-w-xl mx-auto mb-10">We couldn't find any courses matching your current search criteria. Try using different keywords or resetting filters.</p>
            <button 
              className="btn-outline px-10 py-4 rounded-full font-black text-lg" 
              onClick={() => {setSearchTerm(''); setActiveFilter('All');}}
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Courses;

