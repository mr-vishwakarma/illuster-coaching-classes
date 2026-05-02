import { useRef, useState, forwardRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import useSound from 'use-sound';
import { ChevronLeft, ChevronRight, BookOpen, List, Loader2 } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';

const PAGE_BG    = '#8a76ffff';   
const ACCENT     = '#3500e4ff';   
const DARK_TXT   = '#2D2B3D';
const BORDER_CLR = '#ff802bff';   

const SpiralBinding = ({ isMobile }: { isMobile: boolean }) => {
  const ringCount = 18;
  const ringH     = 18;
  const gap       = 6;
  const totalH    = ringCount * (ringH + gap);

  return (
    <div
      className={`absolute inset-y-0 z-30 pointer-events-none flex items-center justify-center transition-all duration-500 ${
        isMobile ? 'left-0' : 'left-1/2 -translate-x-1/2'
      }`}
      style={{ width: isMobile ? 20 : 28 }}
    >
      <svg
        width={isMobile ? 20 : 28}
        height={totalH}
        viewBox={`0 0 ${isMobile ? 20 : 28} ${totalH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: ringCount }).map((_, i) => {
          const y = i * (ringH + gap);
          return (
            <g key={i}>
              <rect x={2} y={y + 2} width={isMobile ? 16 : 24} height={ringH - 4} rx={5}
                    fill="#b0a8c8" opacity={0.5} />
              <rect x={0} y={y} width={isMobile ? 20 : 28} height={ringH} rx={6}
                    fill="url(#ringGrad)" stroke="#c8c0e0" strokeWidth={0.8} />
              <rect x={isMobile ? 4 : 6} y={y + 4} width={isMobile ? 12 : 16} height={ringH - 8} rx={3}
                    fill="#e2dff3" opacity={0.7} />
            </g>
          );
        })}
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#a391d8ff" />
            <stop offset="40%"  stopColor="#433d6eff" />
            <stop offset="70%"  stopColor="#c8bfe8" />
            <stop offset="100%" stopColor="#b8b0d8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

/* ─────────────────────── Page wrapper ───────────────────────  */
const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; bg?: string }>(
  ({ children, bg = PAGE_BG }, ref) => (
    <div
      ref={ref}
      style={{ 
        background: bg, 
        boxShadow: 'inset -8px 0 20px rgba(0,0,0,0.06), inset 8px 0 20px rgba(255,255,255,0.3)',
        border: '2px solid rgba(0,0,0,0.08)'
      }}
      className="w-full h-full overflow-hidden select-none relative"
    >
      <div className="absolute inset-y-0 right-0 w-[3px] bg-black/5 z-20"></div>
      {children}
    </div>
  )
);
Page.displayName = 'Page';

const CoverPage = forwardRef<HTMLDivElement>((_, ref) => (
  <Page ref={ref} bg={PAGE_BG}>
    <div className="w-full h-full flex flex-col items-center justify-center p-6 md:p-8 relative">
      <div style={{ color: 'white' }} className="mb-4 opacity-80">
        <BookOpen size={44} strokeWidth={1.2} />
      </div>
      <p style={{ color: 'white', letterSpacing: '0.4em', fontSize: 8 }}
         className="font-bold uppercase mb-3 opacity-90 text-center">
        ILLUSTER COACHING CLASSES
      </p>
      <h1 style={{ color: 'white', lineHeight: 1.05 }}
          className="text-3xl md:text-4xl font-black text-center mb-4 tracking-tighter">
        THE&nbsp;SUCCESS<br/>DIARY
      </h1>
      <div style={{ background: BORDER_CLR }} className="h-0.5 w-14 mb-4 rounded-full" />
      <p style={{ color: 'white' }} className="text-[10px] md:text-[11px] font-medium tracking-widest uppercase opacity-80">
        Annual Edition 2024
      </p>
      <div style={{ background: 'white', opacity: 0.2 }}
           className="absolute top-5 right-5 w-14 h-14 rounded-full blur-xl" />
      <div style={{ background: ACCENT, opacity: 0.3 }}
           className="absolute bottom-8 left-6 w-10 h-10 rounded-full blur-xl" />
    </div>
  </Page>
));
CoverPage.displayName = 'CoverPage';

interface ChapterEntry { num: number; title: string; subtitle: string; page: number }
const chapters: ChapterEntry[] = [
  { num: 1, title: 'Our Milestones',  subtitle: 'A decade of excellence',   page: 2 },
  { num: 2, title: 'Hall of Toppers', subtitle: 'Students who conquered',   page: 6 },
  { num: 3, title: 'What We Provide', subtitle: 'Resources & ecosystem',    page: 10 },
];

const IndexPage = forwardRef<HTMLDivElement, { onJump: (p: number) => void }>(
  ({ onJump }, ref) => (
    <Page ref={ref} bg={PAGE_BG}>
      <div className="p-6 md:p-8 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <List size={18} style={{ color: 'white' }} />
          <h2 style={{ color: 'white' }} className="text-lg md:text-xl font-black tracking-tight">
            Table of Contents
          </h2>
        </div>
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {chapters.map(ch => (
            <button
              key={ch.num}
              onClick={() => onJump(ch.page)}
              style={{ background: 'rgba(255,255,255,0.1)', borderLeft: `4px solid ${BORDER_CLR}` }}
              className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: 'white', fontSize: 8 }}
                     className="font-black uppercase tracking-widest mb-0.5 opacity-80">
                    Chapter {ch.num}
                  </p>
                  <h3 style={{ color: 'white' }} className="text-sm md:text-base font-black">{ch.title}</h3>
                  <p style={{ color: 'white' }} className="text-[9px] md:text-[10px] font-medium opacity-60">{ch.subtitle}</p>
                </div>
                <span style={{ color: 'white' }}
                      className="text-xl md:text-2xl font-black opacity-20 group-hover:opacity-40 transition-opacity">
                  {String(ch.page).padStart(2, '0')}
                </span>
              </div>
            </button>
          ))}
        </div>
        <p style={{ color: 'white', fontSize: 8 }} className="text-center tracking-widest uppercase mt-4 opacity-40">
          Flip pages to explore →
        </p>
      </div>
    </Page>
  )
);
IndexPage.displayName = 'IndexPage';

interface PageData {
  side: 'left' | 'right';
  chapter: string;
  title: string;
  body: string;
  tag?: string;
  imageUrl: string;
  imageLabel: string;
  accent: string;
}

// Static pages removed - now fetching from Supabase 'success_diary' table

const ContentPage = forwardRef<HTMLDivElement, { data: PageData; pageNum: number }>(
  ({ data, pageNum }, ref) => (
    <Page ref={ref} bg={PAGE_BG}>
      <div className="w-full h-full flex flex-col p-6 md:p-7 gap-3">
        <div className="flex items-center justify-between">
          <p style={{ color: 'white', fontSize: 8 }} className="font-black uppercase tracking-[0.35em] opacity-80">
            {data.chapter}
          </p>
          {data.tag && (
            <span style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 8 }}
                  className="px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
              {data.tag}
            </span>
          )}
        </div>

        <div className="relative w-full rounded-xl overflow-hidden flex-1 max-h-[44%] shadow-lg">
          <img src={data.imageUrl} alt={data.imageLabel} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          <p style={{ fontSize: 8 }}
             className="absolute bottom-2 left-3 text-white/90 font-black uppercase tracking-widest">
            {data.imageLabel}
          </p>
        </div>

        <div style={{ background: 'white' }} className="h-px w-8 rounded-full opacity-30" />
        <h2 style={{ color: 'white', lineHeight: 1.1 }} className="text-lg md:text-xl font-black tracking-tight">
          {data.title}
        </h2>
        <p style={{ color: 'white' }} className="text-[10px] md:text-[11px] leading-relaxed flex-1 opacity-80">
          {data.body}
        </p>
        <p style={{ color: 'white', fontSize: 8 }}
           className="font-black uppercase tracking-widest text-right opacity-30">
          {String(pageNum).padStart(2, '0')}
        </p>
      </div>
    </Page>
  )
);
ContentPage.displayName = 'ContentPage';

const BackCover = forwardRef<HTMLDivElement>((_, ref) => (
  <Page ref={ref} bg="#2D2B3D">
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div style={{ color: PAGE_BG, opacity: 0.2 }} className="mb-5">
        <BookOpen size={56} strokeWidth={1} />
      </div>
      <h2 style={{ color: PAGE_BG }} className="text-xl md:text-2xl font-black text-center mb-3 tracking-tighter">
        Your Journey<br />Starts Here.
      </h2>
      <div style={{ background: BORDER_CLR }} className="h-0.5 w-10 mb-4 rounded-full opacity-60" />
      <p style={{ color: PAGE_BG, opacity: 0.4 }} className="text-[10px] text-center tracking-widest uppercase">
        illuster.in
      </p>
    </div>
  </Page>
));
BackCover.displayName = 'BackCover';

const SuccessBook = () => {
  const bookRef = useRef<any>(null);
  const [pages, setPages] = useState<PageData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const totalPages = 2 + pages.length + 1; 

  const [playFlip] = useSound('/sounds/dragon-studio-flipping-book-page-499646.mp3', { volume: 0.65 });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    fetchDiaryPages();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchDiaryPages = async () => {
    try {
      const { data, error } = await supabase
        .from('success_diary')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      if (data) {
        setPages(data.map((p, idx) => ({
          side: idx % 2 === 0 ? 'left' : 'right',
          chapter: p.chapter,
          title: p.title,
          body: p.body,
          tag: p.tag,
          imageUrl: p.image_url,
          imageLabel: p.image_label,
          accent: p.accent_color || ACCENT
        })));
      }
    } catch (err) {
      console.error('Error fetching diary:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const flip = (dir: 'next' | 'prev') => {
    playFlip();
    if (dir === 'next') bookRef.current?.pageFlip()?.flipNext();
    else                bookRef.current?.pageFlip()?.flipPrev();
  };

  const jumpTo = (pageIndex: number) => {
    playFlip();
    bookRef.current?.pageFlip()?.turnToPage(pageIndex);
  };

  const onFlip = (e: { data: number }) => setCurrentPage(e.data);

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center min-h-[500px]" style={{ background: '#e5e5e5' }}>
        <Loader2 className="animate-spin text-[#3500e4ff] mb-4" size={48} />
        <p className="text-[#2D2B3D] font-bold animate-pulse tracking-widest uppercase text-xs">Opening the Success Diary...</p>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 overflow-hidden" style={{ background: '#e5e5e5ff' }}>
      <div className="container mx-auto px-4 text-center mb-8 md:mb-14">
        <p style={{ color: ACCENT, letterSpacing: '0.4em', fontSize: 10 }}
           className="font-black uppercase mb-3">Our Story in Pages</p>
        <h2 style={{ color: DARK_TXT }} className="text-3xl md:text-6xl font-black mb-3 tracking-tighter">
          The <span style={{ color: ACCENT }}>Illuster</span> Diary
        </h2>
        <p style={{ color: '#7a7890' }} className="max-w-md mx-auto text-xs md:text-sm font-medium">
          Flip through our chapters of milestones, toppers, and everything we offer.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-4">
        <div className="flex items-center justify-center gap-4 order-2 md:order-1">
          <button
            onClick={() => flip('prev')}
            disabled={currentPage === 0}
            style={{ background: '#c8c0e820', border: '1px solid #c8c0e840', color: DARK_TXT }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-black/5 transition-all shrink-0"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div
          style={{
            border: `${isMobile ? '6px' : '12px'} solid ${BORDER_CLR}`,
            borderRadius: isMobile ? '16px' : '22px',
            padding: isMobile ? '6px' : '12px',
            background: '#d4956a',
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.35), 0 15px 40px rgba(0,0,0,0.15)',
            position: 'relative',
          }}
          className="order-1 md:order-2"
        >
          <div style={{ borderRadius: isMobile ? '8px' : '12px', overflow: 'hidden', position: 'relative' }}>
            <SpiralBinding isMobile={isMobile} />
            {/* @ts-expect-error react-pageflip types */}
            <HTMLFlipBook
              ref={bookRef}
              width={isMobile ? 280 : 420}
              height={isMobile ? 400 : 580}
              size="fixed"
              minWidth={200}
              maxWidth={500}
              minHeight={300}
              maxHeight={750}
              showCover={!isMobile}
              mobileScrollSupport
              onFlip={onFlip}
              drawShadow
              flippingTime={800}
              startPage={0}
              usePortrait={isMobile}
              startZIndex={10}
              autoSize={false}
              clickEventForward
              useMouseEvents
              swipeDistance={30}
              showPageCorners
              disableFlipByClick={false}
              className=""
            >
              <CoverPage />
              <IndexPage onJump={jumpTo} />
              {pages.map((p, i) => (
                <ContentPage key={i} data={p} pageNum={i + 2} />
              ))}
              <BackCover />
            </HTMLFlipBook>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 order-3">
          <button
            onClick={() => flip('next')}
            disabled={currentPage >= totalPages - 1}
            style={{ background: '#c8c0e820', border: '1px solid #c8c0e840', color: DARK_TXT }}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center disabled:opacity-20 hover:bg-black/5 transition-all shrink-0"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 md:gap-3 mt-8 md:mt-10 flex-wrap px-4 max-w-2xl mx-auto">
        {chapters.map(ch => (
          <button
            key={ch.num}
            onClick={() => jumpTo(ch.page)}
            style={{
              background: ACCENT + '18',
              border: `1px solid ${ACCENT}40`,
              color: DARK_TXT,
            }}
            className="px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black/5 transition-all"
          >
            Ch.{ch.num}
          </button>
        ))}
      </div>

      <p style={{ color: '#7a7890' }} className="text-center mt-4 text-[10px] md:text-[11px] font-medium">
        Page {currentPage + 1} / {totalPages}
      </p>
    </div>
  );
};

export default SuccessBook;
