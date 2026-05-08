import { useState, useMemo, useEffect } from 'react';
import { 
  Book, PlayCircle, FileText, Calendar, Clock, Video,
  HelpCircle, ChevronRight, TrendingUp, BarChart3,
  Zap, BookOpen, Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { courses, studyMaterials } from '../../courses';
import { upcomingClasses } from '../../live-class';
import { QuestieForm } from '../../questies/components/QuestieForm';
import { QuestieList } from '../../questies/components/QuestieList';
import { DashboardHeader } from '../components/DashboardHeader';
import { MyCourses } from '../components/MyCourses';
import { supabase } from '../../../shared/lib/supabase';
import MobileBottomNav from '../components/MobileBottomNav';
import { DashboardTour } from '../components/DashboardTour';

// ─── Live Banner ──────────────────────────────────────────────
const LiveBanner = ({ session }: { session: any }) => (
  <Link
    to={`/live-class/${session.id}`}
    className="group flex items-center justify-between px-4 md:px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg hover:from-red-500 hover:to-red-400 transition-all"
  >
    <div className="flex items-center gap-3">
      <span className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1.5 shrink-0 border border-white/20">
        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live Now
      </span>
      <span className="font-semibold text-sm truncate">
        <span className="opacity-70">{session.profiles?.full_name || 'Your Tutor'}:</span>{' '}
        <span className="font-bold">{session.title}</span>
        <span className="hidden sm:inline opacity-70"> · {session.batch}</span>
      </span>
    </div>
    <span className="shrink-0 flex items-center gap-1.5 text-xs font-black uppercase tracking-widest bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors ml-4">
      <Video size={12} /> Join <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
    </span>
  </Link>
);

// ─── Stat Mini Card ───────────────────────────────────────────
const MiniStat = ({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) => (
  <div className="card p-4 flex items-center gap-3">
    <div className="p-2 rounded-lg shrink-0" style={{ background: `${color}18` }}>
      <div style={{ color }}>{icon}</div>
    </div>
    <div>
      <div className="text-lg font-display font-black text-[var(--text-main)]">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{label}</div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────
const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);

  // Real-time live sessions listener
  useEffect(() => {
    const fetchLiveSessions = async () => {
      const { data } = await supabase
        .from('live_sessions')
        .select('id, title, batch, tutor_id, profiles:tutor_id(full_name)')
        .eq('status', 'live');
      if (data) setLiveSessions(data);
    };

    fetchLiveSessions();

    const channel = supabase
      .channel('student_live_sessions_watch')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions' }, fetchLiveSessions)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const enrolledCourseData = useMemo(() =>
    courses.filter(c => user?.enrolledCourses?.includes(c.id)),
  [user?.enrolledCourses]);

  const myMaterials = useMemo(() =>
    studyMaterials.filter(m => user?.enrolledCourses?.includes(m.courseId)),
  [user?.enrolledCourses]);

  const recentMaterials = useMemo(() => myMaterials.slice(0, 5), [myMaterials]);

  const myClasses = useMemo(() =>
    upcomingClasses.filter(c => user?.enrolledCourses?.includes(c.courseId)),
  [user?.enrolledCourses]);

  const navTabs = [
    { id: 'overview',        label: 'Home',      icon: <BarChart3 size={18} /> },
    { id: 'my-courses',      label: 'Courses',   icon: <BookOpen size={18} /> },
    { id: 'study-materials', label: 'Materials', icon: <FileText size={18} /> },
    { id: 'questies',        label: 'Doubts',    icon: <HelpCircle size={18} /> },
    { id: 'schedule',        label: 'Schedule',  icon: <Calendar size={18} /> },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="bg-[var(--bg-main)] min-h-screen flex flex-col">

      {/* Fixed Navbar */}
      <div className="tour-dashboard-header fixed top-0 left-0 right-0 h-[4.5rem] bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-light)] z-50 px-4 md:px-6 flex items-center">
        <div className="container mx-auto">
          <DashboardHeader />
        </div>
      </div>

      <div className="flex-1 pt-[4.5rem]">
        {/* Live Class Banners */}
        {liveSessions.map(session => (
          <LiveBanner key={session.id} session={session} />
        ))}

        {/* Hero Header */}
        <div className="bg-[var(--bg-card)] border-b border-[var(--border-light)]">
          <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Avatar + Greeting */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-display text-2xl font-bold shadow-lg shadow-orange-500/20 shrink-0">
                  {user?.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-0.5">{greeting} ☀️</p>
                  <h1 className="text-xl md:text-3xl font-display font-black text-[var(--text-main)] leading-tight">
                    {user?.name.split(' ')[0]}!
                  </h1>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {myClasses.length > 0
                      ? `${myClasses.length} class${myClasses.length > 1 ? 'es' : ''} coming up this week`
                      : 'Keep learning — consistency is key.'}
                  </p>
                </div>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <MiniStat icon={<BookOpen size={16} />} value={enrolledCourseData.length} label="Courses" color="#f97316" />
                <MiniStat icon={<TrendingUp size={16} />} value="45%" label="Progress" color="#8a76ff" />
                <MiniStat icon={<Zap size={16} />} value={myClasses.length} label="Upcoming" color="#10b981" />
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Tab Bar - desktop only */}
        <div className="hidden lg:block bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-light)] sticky top-[4.5rem] z-30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {navTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 py-3.5 px-4 md:px-6 font-bold text-xs whitespace-nowrap transition-all border-b-2 uppercase tracking-widest ${
                    activeTab === tab.id
                      ? 'text-orange-500 border-orange-500'
                      : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)]'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-10 pb-24 lg:pb-10">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">

              {/* Left: main content */}
              <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">

                {/* Enrolled Courses */}
                <section className="tour-my-courses">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-display font-black text-[var(--text-main)]">Enrolled Courses</h2>
                    <button onClick={() => setActiveTab('my-courses')} className="text-orange-500 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                      View All <ChevronRight size={12} />
                    </button>
                  </div>
                  {enrolledCourseData.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {enrolledCourseData.slice(0, 4).map(course => (
                        <div key={course.id} className="card p-5 flex flex-col group hover:border-orange-500/40 transition-all cursor-pointer">
                          <div className="flex items-center gap-3 mb-5">
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shadow-md shrink-0" style={{ background: `${course.color}15`, color: course.color }}>
                              {course.icon}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-bold text-sm text-[var(--text-main)] group-hover:text-orange-500 transition-colors truncate">{course.title}</h3>
                              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{course.subject}</span>
                            </div>
                          </div>
                          <div className="mt-auto">
                            <div className="flex justify-between text-[10px] mb-1.5">
                              <span className="font-bold text-[var(--text-muted)] uppercase tracking-widest">Progress</span>
                              <span className="text-orange-500 font-black">45%</span>
                            </div>
                            <div className="w-full h-1.5 bg-[var(--bg-main)] rounded-full overflow-hidden">
                              <div className="w-[45%] h-full bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)] transition-all duration-1000" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="card p-10 text-center">
                      <Book size={32} className="mx-auto text-[var(--text-muted)] opacity-20 mb-3" />
                      <p className="text-sm text-[var(--text-muted)] italic">You haven't enrolled in any courses yet.</p>
                      <Link to="/courses" className="inline-block mt-4 px-6 py-2.5 rounded-xl bg-orange-500 text-white text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
                        Browse Courses
                      </Link>
                    </div>
                  )}
                </section>

                {/* Recent Study Materials */}
                <section className="tour-study-materials">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-display font-black text-[var(--text-main)]">Recent Study Materials</h2>
                    <button onClick={() => setActiveTab('study-materials')} className="text-orange-500 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                      View All <ChevronRight size={12} />
                    </button>
                  </div>

                  {recentMaterials.length > 0 ? (
                    <div className="card overflow-hidden divide-y divide-[var(--border-light)]">
                      {recentMaterials.map(mat => (
                        <div key={mat.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-main)] transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-lg shrink-0 ${mat.type === 'video' ? 'bg-purple-500/10 text-purple-400' : mat.type === 'pdf' ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                              {mat.type === 'video' ? <PlayCircle size={18} /> : mat.type === 'pdf' ? <FileText size={18} /> : <Book size={18} />}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-sm text-[var(--text-main)] truncate">{mat.title}</h4>
                              <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">
                                <span>{mat.chapter}</span>
                                <span>·</span>
                                <span>{mat.type === 'video' ? mat.duration : mat.type === 'pdf' ? mat.size : 'Assessment'}</span>
                              </div>
                            </div>
                          </div>
                          <button className="ml-3 shrink-0 px-3 py-1.5 rounded-lg border border-[var(--border-light)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-card)] hover:border-transparent transition-all">
                            {mat.type === 'video' ? 'Watch' : mat.type === 'pdf' ? 'Open' : 'Start'}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="card p-10 text-center">
                      <FileText size={32} className="mx-auto text-[var(--text-muted)] opacity-20 mb-3" />
                      <p className="text-sm text-[var(--text-muted)] italic">No materials available yet for your courses.</p>
                    </div>
                  )}
                </section>
              </div>

              {/* Right: Sidebar */}
              <div className="flex flex-col gap-5">

                {/* Live Now section */}
                {liveSessions.length > 0 && (
                  <div className="card p-5 border-red-500/20 bg-red-500/5">
                    <h3 className="text-xs font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                      <Radio size={12} className="animate-pulse" /> Happening Now
                    </h3>
                    <div className="flex flex-col gap-2">
                      {liveSessions.map(s => (
                        <Link key={s.id} to={`/live-class/${s.id}`} className="flex items-center justify-between p-3 bg-[var(--bg-main)] rounded-xl hover:border-red-500/30 border border-transparent transition-all group">
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[var(--text-main)] truncate">{s.title}</div>
                            <div className="text-[10px] text-[var(--text-muted)]">{s.batch}</div>
                          </div>
                          <span className="shrink-0 ml-2 text-[10px] font-black uppercase tracking-widest bg-red-500 text-white px-2 py-1 rounded-lg group-hover:bg-red-400 transition-colors">Join</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Classes */}
                <div className="card p-5 tour-upcoming-classes">
                  <h3 className="flex items-center gap-2 text-base font-display font-black mb-4 text-[var(--text-main)]">
                    <Calendar size={16} className="text-orange-500" /> Upcoming Classes
                  </h3>

                  {myClasses.length > 0 ? (
                    <div className="flex flex-col gap-3">
                      {myClasses.slice(0, 3).map(cls => {
                        const course = courses.find(c => c.id === cls.courseId);
                        return (
                          <div key={cls.id} className="p-3 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl hover:border-orange-500/30 transition-all">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 text-[9px] font-black uppercase tracking-widest">{course?.subject}</span>
                              <span className="text-[10px] font-bold text-[var(--text-muted)]">{cls.date}</span>
                            </div>
                            <h4 className="font-bold text-xs text-[var(--text-main)] mb-2 leading-tight">{cls.title}</h4>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-[var(--text-muted)]">
                              <Clock size={10} /> {cls.time}
                            </div>
                          </div>
                        );
                      })}
                      <button onClick={() => setActiveTab('schedule')} className="w-full mt-1 py-2.5 rounded-xl border border-[var(--border-light)] text-[10px] font-black uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-card)] transition-all">
                        Full Schedule
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar size={28} className="mx-auto text-[var(--text-muted)] opacity-20 mb-2" />
                      <p className="text-xs text-[var(--text-muted)] italic">No classes scheduled this week.</p>
                    </div>
                  )}
                </div>

                {/* Doubt Support CTA */}
                <div className="card p-5 bg-gradient-to-br from-[#8a76ff]/10 to-transparent border-[#8a76ff]/20 tour-doubts-cta">
                  <h3 className="flex items-center gap-2 text-base font-display font-black mb-2 text-[var(--text-main)]">
                    <HelpCircle size={16} className="text-[#8a76ff]" /> Need Help?
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mb-4 leading-relaxed">
                    Stuck on a problem? Get step-by-step answers from expert tutors within hours.
                  </p>
                  <button
                    onClick={() => setActiveTab('questies')}
                    className="w-full py-3 rounded-xl bg-[#8a76ff] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#7b65ff] transition-all shadow-lg shadow-[#8a76ff]/20"
                  >
                    Ask a Question
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── MY COURSES TAB ── */}
          {activeTab === 'my-courses' && <MyCourses />}

          {/* ── DOUBTS TAB ── */}
          {activeTab === 'questies' && (
            <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h2 className="text-xl font-display font-black mb-5 text-[var(--text-main)]">Ask a New Doubt</h2>
                <QuestieForm onSubmitted={() => setRefreshTrigger(prev => prev + 1)} />
              </div>
              <div>
                <h2 className="text-xl font-display font-black mb-5 text-[var(--text-main)]">My Doubt History</h2>
                <QuestieList refreshTrigger={refreshTrigger} />
              </div>
            </div>
          )}

          {/* ── STUDY MATERIALS TAB ── */}
          {activeTab === 'study-materials' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-display font-black text-[var(--text-main)]">Study Materials</h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {myMaterials.length} resources across {enrolledCourseData.length} courses
                  </p>
                </div>
                {/* Type filter pills */}
                <div className="flex gap-2 flex-wrap">
                  {(['all', 'video', 'pdf', 'quiz'] as const).map(type => (
                    <button key={type} className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-[var(--border-light)] text-[var(--text-muted)] hover:border-orange-500 hover:text-orange-500 transition-all">
                      {type === 'all' ? 'All' : type === 'video' ? '🎬 Videos' : type === 'pdf' ? '📄 PDFs' : '📝 Quizzes'}
                    </button>
                  ))}
                </div>
              </div>

              {myMaterials.length > 0 ? (
                <div className="card divide-y divide-[var(--border-light)] overflow-hidden">
                  {myMaterials.map(mat => (
                    <div key={mat.id} className="flex items-center justify-between p-4 hover:bg-[var(--bg-main)] transition-colors group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl shrink-0 ${
                          mat.type === 'video' ? 'bg-purple-500/10 text-purple-400' :
                          mat.type === 'pdf'   ? 'bg-red-500/10 text-red-400' :
                                                 'bg-orange-500/10 text-orange-400'
                        }`}>
                          {mat.type === 'video' ? <PlayCircle size={18} /> : mat.type === 'pdf' ? <FileText size={18} /> : <Book size={18} />}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-sm text-[var(--text-main)] truncate group-hover:text-orange-500 transition-colors">{mat.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-0.5">
                            <span>{mat.chapter}</span>
                            <span>·</span>
                            <span>{mat.type === 'video' ? mat.duration : mat.type === 'pdf' ? mat.size : 'Assessment'}</span>
                            <span>·</span>
                            <span className={`${mat.type === 'video' ? 'text-purple-400' : mat.type === 'pdf' ? 'text-red-400' : 'text-orange-400'}`}>
                              {mat.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="ml-3 shrink-0 px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all">
                        {mat.type === 'video' ? '▶ Watch' : mat.type === 'pdf' ? '↓ Open' : '→ Start'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card p-14 text-center">
                  <FileText size={32} className="mx-auto text-[var(--text-muted)] opacity-20 mb-3" />
                  <h3 className="font-display font-black text-lg mb-2 text-[var(--text-main)]">No materials yet</h3>
                  <p className="text-sm text-[var(--text-muted)] italic">Enroll in a course to access study materials.</p>
                </div>
              )}
            </div>
          )}

          {/* ── SCHEDULE PLACEHOLDER ── */}
          {activeTab === 'schedule' && (
            <div className="card p-16 text-center">
              <Calendar size={32} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
              <h2 className="text-xl font-display font-black mb-2 text-[var(--text-main)]">Schedule</h2>
              <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed italic mb-6">
                Full timetable and class calendar coming soon.
              </p>
              <button
                onClick={() => setActiveTab('overview')}
                className="px-8 py-3 rounded-xl bg-orange-500 text-white font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
              >
                Back to Overview
              </button>
            </div>
          )}


        </div>
      </div>
      {/* ── MOBILE BOTTOM NAV ── */}
      <MobileBottomNav
        tabs={navTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <DashboardTour role="student" />
    </div>
  );
};


export default StudentDashboard;
