import { useStudentDashboard } from '../hooks/useStudentDashboard';
import { 
  Book, PlayCircle, FileText, Calendar,
  HelpCircle, ChevronRight, BarChart3,
  BookOpen, Radio
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { QuestieForm } from '../../collaboration/questies/components/QuestieForm';
import { QuestieList } from '../../collaboration/questies/components/QuestieList';
import { DashboardHeader } from '../../../shared/components/layout/DashboardHeader';
import { MyCourses } from '../components/MyCourses';
import { LiveBanner } from '../components/LiveBanner';
import { StudentHero } from '../components/StudentHero';
import { StudyMaterialsWidget } from '../components/StudyMaterialsWidget';
import { UpcomingClassesWidget } from '../components/UpcomingClassesWidget';
import MobileBottomNav from '../../../shared/components/layout/MobileBottomNav';
import { DashboardTour } from '../../../shared/components/layout/DashboardTour';



// ─── Main Component ───────────────────────────────────────────
const StudentDashboard = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    refreshTrigger,
    setRefreshTrigger,
    liveSessions,
    enrolledCourseData,
    myMaterials,
    recentMaterials,
    myClasses
  } = useStudentDashboard();

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
        <StudentHero 
          user={user}
          greeting={greeting}
          enrolledCourseCount={enrolledCourseData.length}
          upcomingClassCount={myClasses.length}
        />

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
                      {enrolledCourseData.slice(0, 4).map((course: any) => (
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
                  <StudyMaterialsWidget materials={recentMaterials} />
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
                  <UpcomingClassesWidget classes={myClasses} />
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
                  {myMaterials.map((mat: any) => (
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
