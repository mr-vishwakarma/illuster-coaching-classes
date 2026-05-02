import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Award, Zap } from 'lucide-react';

const bookData = [
  {
    type: 'cover',
    title: 'THE LEGACY OF EXCELLENCE',
    subtitle: 'Illuster Annual Success Book 2024',
    bg: 'bg-orange-600'
  },
  {
    type: 'index',
    title: 'Table of Contents',
    chapters: [
      { id: 1, title: 'Our Milestones', page: 2, icon: <BookOpen size={16} /> },
      { id: 2, title: 'Wall of Toppers', page: 4, icon: <Award size={16} /> },
      { id: 3, title: 'What We Provide', page: 6, icon: <Zap size={16} /> }
    ]
  },
  {
    type: 'content',
    chapter: 'Chapter 1',
    title: 'Our Milestones',
    description: 'A decade of redefining education and setting new benchmarks in coaching.',
    images: [
      { url: 'https://images.unsplash.com/photo-1523050337456-6814427b3d46?q=80&w=400', label: 'Est. 2012' },
      { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=400', label: '100+ Centres' }
    ]
  },
  {
    type: 'content',
    chapter: 'Chapter 1',
    title: 'The Growth',
    description: 'Expanding our horizons to empower students across the nation.',
    images: [
      { url: 'https://images.unsplash.com/photo-1524178232363-1fb28f74b671?q=80&w=400', label: 'Best Institute Award' },
      { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400', label: 'Modern Classrooms' }
    ]
  },
  {
    type: 'content',
    chapter: 'Chapter 2',
    title: 'Hall of Toppers',
    description: 'Our pride—students who conquered the toughest exams with flying colors.',
    images: [
      { url: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=400', label: 'IIT-JEE AIR 42' },
      { url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400', label: 'NEET 710/720' }
    ]
  },
  {
    type: 'content',
    chapter: 'Chapter 2',
    title: 'Rising Stars',
    description: 'Nurturing talent from the grassroots to global success.',
    images: [
      { url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400', label: 'NTSE Scholars' },
      { url: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=400', label: 'Olympiad Gold' }
    ]
  },
  {
    type: 'content',
    chapter: 'Chapter 3',
    title: 'Our Ecosystem',
    description: 'Beyond coaching—we provide a complete environment for academic growth.',
    images: [
      { url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400', label: 'Hi-Tech Labs' },
      { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=400', label: '24/7 Library' }
    ]
  },
  {
    type: 'content',
    chapter: 'Chapter 3',
    title: 'Digital Advantage',
    description: 'Blending traditional teaching with AI-driven learning tools.',
    images: [
      { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400', label: 'Live Portal' },
      { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400', label: 'Testing App' }
    ]
  }
];

const SuccessBook = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextPage = () => {
    if (currentPage < bookData.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const jumpToPage = (pageIndex: number) => {
    setDirection(pageIndex > currentPage ? 1 : -1);
    setCurrentPage(pageIndex);
  };

  return (
    <div className="py-20 bg-black overflow-hidden flex flex-col items-center">
      <div className="container mx-auto px-6 text-center mb-16">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white mb-4">
          The <span className="text-orange-500 italic">Illuster Diary</span>
        </h2>
        <p className="text-white/40 max-w-xl mx-auto font-medium">Flip through our journey, achievements, and the world we provide for our students.</p>
      </div>

      <div className="relative w-full max-w-[900px] h-[500px] md:h-[600px] perspective-[2000px] perspective-origin-center">
        
        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 z-50">
          <button 
            onClick={prevPage}
            disabled={currentPage === 0}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white hover:text-black transition-all"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 z-50">
          <button 
            onClick={nextPage}
            disabled={currentPage === bookData.length - 1}
            className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white disabled:opacity-20 hover:bg-white hover:text-black transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Book Container */}
        <div className="w-full h-full relative preserve-3d">
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              initial={{ rotateY: direction > 0 ? -90 : 90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: direction > 0 ? 90 : -90, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full bg-[#111] rounded-2xl md:rounded-[2.5rem] border-2 border-white/10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
              style={{ transformOrigin: direction > 0 ? 'left center' : 'right center' }}
            >
              {/* Page Background Texture */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] opacity-10 pointer-events-none"></div>
              
              {/* Cover Page */}
              {bookData[currentPage].type === 'cover' && (
                <div className={`w-full h-full flex flex-col items-center justify-center p-8 md:p-20 text-center ${bookData[currentPage].bg}`}>
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-10 border border-white/30 backdrop-blur-md">
                    <BookOpen size={48} className="text-white" />
                  </div>
                  <h3 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-4 tracking-tighter">
                    {bookData[currentPage].title}
                  </h3>
                  <div className="h-1 w-20 bg-white/40 mb-6"></div>
                  <p className="text-white/80 font-black uppercase tracking-[0.3em] text-xs md:text-sm">
                    {bookData[currentPage].subtitle}
                  </p>
                </div>
              )}

              {/* Index Page */}
              {bookData[currentPage].type === 'index' && (
                <div className="w-full h-full p-8 md:p-20 flex flex-col bg-[#151515]">
                  <h3 className="text-3xl md:text-4xl font-display font-black text-white mb-12 flex items-center gap-4">
                    <span className="text-orange-500">#</span> {bookData[currentPage].title}
                  </h3>
                  <div className="space-y-6">
                    {bookData[currentPage].chapters?.map((chapter) => (
                      <button
                        key={chapter.id}
                        onClick={() => jumpToPage(chapter.page)}
                        className="w-full flex items-center justify-between p-4 md:p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-orange-500 hover:border-orange-500 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-orange-500 transition-colors">
                            {chapter.icon}
                          </div>
                          <span className="text-lg md:text-xl font-bold text-white/80 group-hover:text-white">{chapter.title}</span>
                        </div>
                        <span className="text-white/20 group-hover:text-white/60 font-black">PAGE {chapter.page}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Content Pages */}
              {bookData[currentPage].type === 'content' && (
                <div className="w-full h-full flex flex-col md:flex-row">
                  {/* Left Column: Text */}
                  <div className="flex-1 p-8 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-6">
                      {bookData[currentPage].chapter}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-display font-black text-white mb-4 tracking-tight">
                      {bookData[currentPage].title}
                    </h3>
                    <p className="text-white/40 text-sm md:text-lg leading-relaxed font-medium">
                      {bookData[currentPage].description}
                    </p>
                    <div className="mt-8 flex items-center gap-4 text-white/20">
                      <span className="text-xs font-black uppercase tracking-widest">Page {currentPage} / {bookData.length - 1}</span>
                    </div>
                  </div>

                  {/* Right Column: Images */}
                  <div className="flex-1 p-6 md:p-12 grid grid-cols-1 gap-4 bg-black/20">
                    {bookData[currentPage].images?.map((img, i) => (
                      <div key={i} className="relative group overflow-hidden rounded-2xl aspect-video md:aspect-auto">
                        <img 
                          src={img.url} 
                          alt={img.label}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" 
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                          <span className="text-[10px] md:text-xs font-black text-white uppercase tracking-widest">{img.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page Shadow under book */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-4 bg-orange-500/20 blur-3xl rounded-full"></div>
      </div>
      
      {/* Progress Dots */}
      <div className="mt-12 flex gap-2">
        {bookData.map((_, i) => (
          <button
            key={i}
            onClick={() => jumpToPage(i)}
            className={`w-2 h-2 rounded-full transition-all ${currentPage === i ? 'w-8 bg-orange-500' : 'bg-white/10 hover:bg-white/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SuccessBook;
