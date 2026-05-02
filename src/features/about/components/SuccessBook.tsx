import { useRef, useState, forwardRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import useSound from 'use-sound';
import { ChevronLeft, ChevronRight, BookOpen, List } from 'lucide-react';

/* ── palette ─────────────────────────────────────────────── */
const LAVENDER   = '#DDD6F3';
const CREAM      = '#FAF7F2';
const WARM_GRAY  = '#E8E2D9';
const DUSTY_ROSE = '#E8C9C0';
const SAGE       = '#C8D8C0';
const SLATE_TXT  = '#4A4458';
const DARK_TXT   = '#2D2B3D';
const ACCENT     = '#9B8EC4';   // deeper lavender accent

/* ── page wrapper ────────────────────────────────────────── */
const Page = forwardRef<HTMLDivElement, { children: React.ReactNode; bg?: string }>(
  ({ children, bg = CREAM }, ref) => (
    <div
      ref={ref}
      style={{ background: bg, boxShadow: 'inset -4px 0 12px rgba(0,0,0,0.06)' }}
      className="w-full h-full overflow-hidden select-none"
    >
      {children}
    </div>
  )
);
Page.displayName = 'Page';

/* ── COVER ───────────────────────────────────────────────── */
const CoverPage = forwardRef<HTMLDivElement>((_, ref) => (
  <Page ref={ref} bg={LAVENDER}>
    <div className="w-full h-full flex flex-col items-center justify-center p-8 relative">
      <div style={{ color: ACCENT }} className="mb-4 opacity-60">
        <BookOpen size={48} strokeWidth={1.2} />
      </div>
      <p style={{ color: ACCENT, letterSpacing: '0.4em', fontSize: 10 }}
         className="font-bold uppercase mb-4">
        ILLUSTER COACHING CLASSES
      </p>
      <h1 style={{ color: DARK_TXT, lineHeight: 1.1 }}
          className="text-5xl font-black text-center mb-4 tracking-tighter">
        THE&nbsp;SUCCESS<br/>DIARY
      </h1>
      <div style={{ background: ACCENT }} className="h-0.5 w-16 mb-4 rounded-full" />
      <p style={{ color: SLATE_TXT }} className="text-sm font-medium tracking-widest uppercase">
        Annual Edition 2024
      </p>
      {/* corner decorations */}
      <div style={{ background: DUSTY_ROSE, opacity: 0.5 }}
           className="absolute top-6 right-6 w-16 h-16 rounded-full blur-xl" />
      <div style={{ background: SAGE, opacity: 0.5 }}
           className="absolute bottom-10 left-8 w-12 h-12 rounded-full blur-xl" />
    </div>
  </Page>
));
CoverPage.displayName = 'CoverPage';

/* ── INDEX ───────────────────────────────────────────────── */
interface ChapterEntry { num: number; title: string; subtitle: string; page: number }
const chapters: ChapterEntry[] = [
  { num: 1, title: 'Our Milestones',   subtitle: 'A decade of excellence',          page: 2 },
  { num: 2, title: 'Hall of Toppers',  subtitle: 'Students who conquered',          page: 6 },
  { num: 3, title: 'What We Provide',  subtitle: 'Resources & ecosystem',           page: 10 },
];

const IndexPage = forwardRef<HTMLDivElement, { onJump: (p: number) => void }>(
  ({ onJump }, ref) => (
    <Page ref={ref} bg={CREAM}>
      <div className="p-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <List size={20} style={{ color: ACCENT }} />
          <h2 style={{ color: DARK_TXT }} className="text-2xl font-black tracking-tight">
            Table of Contents
          </h2>
        </div>
        <div className="flex flex-col gap-4 flex-1">
          {chapters.map(ch => (
            <button
              key={ch.num}
              onClick={() => onJump(ch.page)}
              style={{ background: LAVENDER, borderLeft: `4px solid ${ACCENT}` }}
              className="w-full text-left px-5 py-4 rounded-xl hover:brightness-95 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p style={{ color: ACCENT, fontSize: 10 }}
                     className="font-black uppercase tracking-widest mb-1">
                    Chapter {ch.num}
                  </p>
                  <h3 style={{ color: DARK_TXT }} className="text-lg font-black">{ch.title}</h3>
                  <p style={{ color: SLATE_TXT }} className="text-xs font-medium mt-0.5">{ch.subtitle}</p>
                </div>
                <span style={{ color: ACCENT }} className="text-3xl font-black opacity-30 group-hover:opacity-60 transition-opacity">
                  {String(ch.page).padStart(2, '0')}
                </span>
              </div>
            </button>
          ))}
        </div>
        <p style={{ color: WARM_GRAY, fontSize: 9 }} className="text-center tracking-widest uppercase mt-6">
          Flip pages to explore →
        </p>
      </div>
    </Page>
  )
);
IndexPage.displayName = 'IndexPage';

/* ── content data ────────────────────────────────────────── */
interface PageData {
  side: 'left' | 'right';
  chapter: string;
  title: string;
  body: string;
  tag?: string;
  imageUrl: string;
  imageLabel: string;
  bg: string;
  accent: string;
}

const pages: PageData[] = [
  /* Chapter 1 spread 1 */
  {
    side: 'left', chapter: 'Chapter 01', title: 'Est. 2012',
    body: 'Illuster was founded with a simple promise: every student deserves world-class guidance. Today, over 15,000 students have walked through our doors and emerged as toppers.',
    imageUrl: 'https://images.unsplash.com/photo-1523050337456-6814427b3d46?w=500&q=80',
    imageLabel: 'Founding Day', bg: LAVENDER, accent: ACCENT, tag: 'Our Beginning'
  },
  {
    side: 'right', chapter: 'Chapter 01', title: '100+ Centres',
    body: 'From a single classroom, Illuster now operates across 100+ study centres in 8 cities, bringing elite JEE and NEET coaching closer to every aspiring student.',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=500&q=80',
    imageLabel: 'Expansion', bg: CREAM, accent: ACCENT, tag: 'Growth'
  },
  /* Chapter 1 spread 2 */
  {
    side: 'left', chapter: 'Chapter 01', title: 'Best Institute Award',
    body: 'Recognized 12 times by leading education bodies for outstanding academic results and student satisfaction scores above 97%.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb28f74b671?w=500&q=80',
    imageLabel: 'Award Ceremony', bg: WARM_GRAY, accent: ACCENT, tag: 'Recognition'
  },
  {
    side: 'right', chapter: 'Chapter 01', title: 'Modern Classrooms',
    body: 'Cutting-edge infrastructure with air-conditioned rooms, smart boards, high-speed labs, and live-session recording for every batch.',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&q=80',
    imageLabel: 'Infrastructure', bg: CREAM, accent: ACCENT, tag: 'Facilities'
  },
  /* Chapter 2 spread 1 */
  {
    side: 'left', chapter: 'Chapter 02', title: 'IIT-JEE AIR 42',
    body: 'Aryan Mehta cracked IIT-JEE with an All India Rank of 42 after 2 years at Illuster. His secret? Consistent doubt sessions and our legendary test series.',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80',
    imageLabel: 'Aryan Mehta – AIR 42', bg: DUSTY_ROSE, accent: '#A0584A', tag: 'Hall of Fame'
  },
  {
    side: 'right', chapter: 'Chapter 02', title: 'NEET 710 / 720',
    body: 'Priya Sharma scored 710 in NEET, securing admission to AIIMS Delhi. Her journey at Illuster is a testament to discipline and structured learning.',
    imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=500&q=80',
    imageLabel: 'Priya Sharma – NEET 710', bg: CREAM, accent: ACCENT, tag: 'Medical Topper'
  },
  /* Chapter 2 spread 2 */
  {
    side: 'left', chapter: 'Chapter 02', title: 'NTSE Scholars',
    body: 'Over 340 students cleared NTSE from Illuster batches in 2024 alone, placing us among the top 5 institutes nationally for NTSE coaching.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80',
    imageLabel: 'NTSE Batch 2024', bg: SAGE, accent: '#4A7C59', tag: 'Scholarship'
  },
  {
    side: 'right', chapter: 'Chapter 02', title: 'Olympiad Gold',
    body: 'International Science Olympiad gold medalists trained exclusively at Illuster, showcasing our reach beyond national competitive exams.',
    imageUrl: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&q=80',
    imageLabel: 'Olympiad Winners', bg: CREAM, accent: ACCENT, tag: 'Global'
  },
  /* Chapter 3 spread 1 */
  {
    side: 'left', chapter: 'Chapter 03', title: 'Hi-Tech Labs',
    body: 'State-of-the-art physics, chemistry and biology labs designed for hands-on learning, reinforcing concepts that textbooks alone cannot teach.',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80',
    imageLabel: 'Science Lab', bg: LAVENDER, accent: ACCENT, tag: 'Infrastructure'
  },
  {
    side: 'right', chapter: 'Chapter 03', title: '24 / 7 Library',
    body: 'A curated library with 10,000+ books, e-resources, and silent study pods available around the clock for every enrolled student.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&q=80',
    imageLabel: 'Library', bg: CREAM, accent: ACCENT, tag: 'Resources'
  },
  /* Chapter 3 spread 2 */
  {
    side: 'left', chapter: 'Chapter 03', title: 'Live Portal',
    body: 'Our proprietary EdTech platform enables live classes, recorded lectures, AI-powered doubt resolution, and personalised progress analytics.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&q=80',
    imageLabel: 'Student Portal', bg: WARM_GRAY, accent: ACCENT, tag: 'Technology'
  },
  {
    side: 'right', chapter: 'Chapter 03', title: 'Testing App',
    body: 'Weekly adaptive mock tests, chapter-wise DPPs, and all-India ranking simulations prepare our students for exam-day performance like no other.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&q=80',
    imageLabel: 'Assessment Suite', bg: CREAM, accent: ACCENT, tag: 'Practice'
  },
];

/* ── content page ────────────────────────────────────────── */
const ContentPage = forwardRef<HTMLDivElement, { data: PageData; pageNum: number }>(
  ({ data, pageNum }, ref) => (
    <Page ref={ref} bg={data.bg}>
      <div className="w-full h-full flex flex-col p-8 gap-4">
        {/* chapter + tag row */}
        <div className="flex items-center justify-between">
          <p style={{ color: data.accent, fontSize: 9 }} className="font-black uppercase tracking-[0.35em]">
            {data.chapter}
          </p>
          {data.tag && (
            <span style={{ background: data.accent + '20', color: data.accent, fontSize: 9 }}
                  className="px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
              {data.tag}
            </span>
          )}
        </div>

        {/* image */}
        <div className="relative w-full rounded-xl overflow-hidden flex-1 max-h-[45%]">
          <img
            src={data.imageUrl}
            alt={data.imageLabel}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <p style={{ fontSize: 9 }}
             className="absolute bottom-2 left-3 text-white/80 font-black uppercase tracking-widest">
            {data.imageLabel}
          </p>
        </div>

        {/* divider */}
        <div style={{ background: data.accent }} className="h-px w-10 rounded-full opacity-40" />

        {/* title */}
        <h2 style={{ color: DARK_TXT, lineHeight: 1.1 }}
            className="text-2xl font-black tracking-tight">
          {data.title}
        </h2>

        {/* body */}
        <p style={{ color: SLATE_TXT }} className="text-xs leading-relaxed flex-1">
          {data.body}
        </p>

        {/* page number */}
        <p style={{ color: data.accent, fontSize: 9 }}
           className="font-black uppercase tracking-widest text-right opacity-50">
          {String(pageNum).padStart(2, '0')}
        </p>
      </div>
    </Page>
  )
);
ContentPage.displayName = 'ContentPage';

/* ── back cover ──────────────────────────────────────────── */
const BackCover = forwardRef<HTMLDivElement>((_, ref) => (
  <Page ref={ref} bg={DARK_TXT}>
    <div className="w-full h-full flex flex-col items-center justify-center p-8">
      <div style={{ color: LAVENDER, opacity: 0.2 }} className="mb-6">
        <BookOpen size={64} strokeWidth={1} />
      </div>
      <h2 style={{ color: LAVENDER }} className="text-3xl font-black text-center mb-3 tracking-tighter">
        Your Journey<br />Starts Here.
      </h2>
      <div style={{ background: ACCENT }} className="h-0.5 w-12 mb-4 rounded-full opacity-60" />
      <p style={{ color: LAVENDER, opacity: 0.5 }}
         className="text-xs text-center tracking-widest uppercase">
        illuster.in
      </p>
    </div>
  </Page>
));
BackCover.displayName = 'BackCover';

/* ── MAIN COMPONENT ──────────────────────────────────────── */
const SuccessBook = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2 + 2 + pages.length + 1; // cover + index + content + back

  const [playFlip] = useSound('/sounds/page-flip.wav', { volume: 0.6 });

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

  return (
    <div className="py-20 overflow-hidden" style={{ background: '#1C1A2E' }}>
      {/* header */}
      <div className="container mx-auto px-6 text-center mb-14">
        <p style={{ color: ACCENT, letterSpacing: '0.4em', fontSize: 11 }}
           className="font-black uppercase mb-3">Our Story in Pages</p>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter">
          The <span style={{ color: ACCENT }}>Illuster</span> Diary
        </h2>
        <p style={{ color: '#8884a0' }} className="max-w-md mx-auto text-sm font-medium">
          Flip through our chapters of milestones, toppers, and everything we offer.
        </p>
      </div>

      {/* book + arrows */}
      <div className="flex items-center justify-center gap-4 md:gap-8 px-4">
        <button
          onClick={() => flip('prev')}
          disabled={currentPage === 0}
          style={{ background: LAVENDER + '20', border: `1px solid ${LAVENDER}30` }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/10 transition-all shrink-0"
        >
          <ChevronLeft size={22} />
        </button>

        {/* flipbook */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            boxShadow: `0 40px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px ${ACCENT}20`,
          }}
        >
          {/* @ts-expect-error react-pageflip types */}
          <HTMLFlipBook
            ref={bookRef}
            width={320}
            height={440}
            size="fixed"
            minWidth={220}
            maxWidth={480}
            minHeight={300}
            maxHeight={600}
            showCover
            mobileScrollSupport
            onFlip={onFlip}
            drawShadow
            flippingTime={700}
            startPage={0}
            usePortrait={false}
            startZIndex={10}
            autoSize={false}
            clickEventForward
            useMouseEvents
            swipeDistance={30}
            showPageCorners
            disableFlipByClick={false}
            className=""
          >
            {/* 0 – cover */}
            <CoverPage />

            {/* 1 – index */}
            <IndexPage onJump={jumpTo} />

            {/* 2…N-2 – content */}
            {pages.map((p, i) => (
              <ContentPage key={i} data={p} pageNum={i + 2} />
            ))}

            {/* last – back cover */}
            <BackCover />
          </HTMLFlipBook>
        </div>

        <button
          onClick={() => flip('next')}
          disabled={currentPage >= totalPages - 1}
          style={{ background: LAVENDER + '20', border: `1px solid ${LAVENDER}30` }}
          className="w-12 h-12 rounded-full flex items-center justify-center text-white disabled:opacity-20 hover:bg-white/10 transition-all shrink-0"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* chapter index pills */}
      <div className="flex items-center justify-center gap-3 mt-10 flex-wrap px-4">
        {chapters.map(ch => (
          <button
            key={ch.num}
            onClick={() => jumpTo(ch.page)}
            style={{ background: ACCENT + '18', border: `1px solid ${ACCENT}30`, color: LAVENDER }}
            className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Ch.{ch.num} — {ch.title}
          </button>
        ))}
      </div>

      {/* page counter */}
      <p style={{ color: '#8884a0' }} className="text-center mt-4 text-xs font-medium">
        Page {currentPage + 1} / {totalPages}
      </p>
    </div>
  );
};

export default SuccessBook;
