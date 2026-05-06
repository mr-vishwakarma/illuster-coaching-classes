import { useState, useMemo, useEffect } from 'react';
import { Book, PlayCircle, FileText, Calendar, Clock, Video } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { courses, studyMaterials } from '../../courses';
import { upcomingClasses } from '../../live-class';
import { QuestieForm } from '../../questies/components/QuestieForm';
import { QuestieList } from '../../questies/components/QuestieList';
import { DashboardHeader } from '../components/DashboardHeader';
import { MyCourses } from '../components/MyCourses';
import { HelpCircle } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);

  useEffect(() => {
    const fetchLiveSessions = async () => {
      const { data } = await supabase
        .from('live_sessions')
        .select(`
          id, title, batch, tutor_id, profiles:tutor_id(full_name)
        `)
        .eq('status', 'live');
      if (data) setLiveSessions(data);
    };

    fetchLiveSessions();

    const channel = supabase.channel('live_sessions_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'live_sessions' }, fetchLiveSessions)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const enrolledCourseData = useMemo(() => 
    courses.filter(c => user?.enrolledCourses?.includes(c.id)), 
  [user?.enrolledCourses]);
  
  // Filter materials for enrolled courses
  const myMaterials = useMemo(() => 
    studyMaterials.filter(m => user?.enrolledCourses?.includes(m.courseId)), 
  [user?.enrolledCourses]);
  
  const recentMaterials = useMemo(() => myMaterials.slice(0, 5), [myMaterials]);
  
  // Filter upcoming classes for enrolled courses
  const myClasses = useMemo(() => 
    upcomingClasses.filter(c => user?.enrolledCourses?.includes(c.courseId)), 
  [user?.enrolledCourses]);

  return (
    <div className="bg-[var(--bg-main)] min-h-screen flex flex-col">
      {/* Fixed Top Navbar */}
      <div className="fixed top-0 left-0 right-0 h-[4.5rem] bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-light)] z-50 px-4 md:px-6 flex items-center">
        <div className="container mx-auto">
          <DashboardHeader />
        </div>
      </div>

      <div className="flex-1 pt-[4.5rem]">
        {/* Live Class Banner */}
        {liveSessions.map(session => (
          <div key={session.id} className="bg-red-600 text-white px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-lg z-40 relative">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="bg-white text-red-600 text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest flex items-center gap-1 shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></div> LIVE NOW
              </span>
              <span className="font-bold text-sm md:text-base truncate">
                {session.profiles?.full_name || 'Tutor'} is hosting: {session.title} ({session.batch})
              </span>
            </div>
            <Link to={`/live-class/${session.id}`} className="w-full md:w-auto shrink-0 bg-black/20 hover:bg-black/40 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <Video size={14} /> Join Class
            </Link>
          </div>
        ))}

        {/* Welcome Section */}
        <div className="bg-[var(--bg-card)] text-[var(--text-main)] py-8 md:py-12 border-b border-[var(--border-light)]">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--text-main)] text-[var(--bg-card)] flex items-center justify-center font-display text-2xl md:text-3xl font-bold shadow-xl">
              {user?.avatar}
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-display font-black mb-1 md:mb-2 leading-tight">
                Welcome back, {user?.name.split(' ')[0]}!
              </h1>
              <p className="text-[var(--text-muted)] text-sm md:text-base max-w-xl">
                You have {myClasses.length} upcoming classes this week. Let's keep the momentum going.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-[var(--bg-card)]/80 backdrop-blur-md border-b border-[var(--border-light)] sticky top-[110px] md:top-[150px] z-30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {['overview', 'my-courses', 'study-materials', 'questies', 'schedule'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-4 md:px-8 font-bold text-xs md:text-sm whitespace-nowrap transition-all border-b-2 uppercase tracking-widest ${
                  activeTab === tab 
                    ? 'text-orange-500 border-orange-500' 
                    : 'text-[var(--text-muted)] border-transparent hover:text-[var(--text-main)]'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Main Content - Left 2 columns */}
            <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
              
              {/* Active Courses Summary */}
              <section>
                <h2 className="text-xl md:text-2xl font-display font-black mb-4 md:mb-6">Your Enrolled Courses</h2>
                <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                  {enrolledCourseData.map(course => (
                    <div key={course.id} className="card p-5 md:p-6 flex flex-col group hover:border-orange-500/50 transition-all">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl shadow-lg" style={{ backgroundColor: `${course.color}15`, color: course.color }}>
                          {course.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-base md:text-lg group-hover:text-orange-500 transition-colors">{course.title}</h3>
                          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{course.subject}</span>
                        </div>
                      </div>
                      
                      {/* Fake Progress Bar */}
                      <div className="mt-auto">
                        <div className="flex justify-between text-[10px] md:text-xs mb-2">
                          <span className="font-bold text-[var(--text-muted)] uppercase tracking-widest">Course Progress</span>
                          <span className="text-orange-500 font-black">45%</span>
                        </div>
                        <div className="w-full h-1.5 md:h-2 bg-[var(--bg-main)] rounded-full overflow-hidden">
                          <div className="w-[45%] h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Materials */}
              <section>
                <div className="flex justify-between items-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-display font-black">Recent Study Materials</h2>
                  <button onClick={() => setActiveTab('study-materials')} className="text-orange-500 font-bold text-xs md:text-sm hover:underline">View All</button>
                </div>
                
                <div className="card overflow-hidden">
                  {recentMaterials.map((mat, idx) => (
                    <div key={mat.id} className={`flex items-center justify-between p-4 md:p-6 ${idx !== recentMaterials.length - 1 ? 'border-b border-[var(--border-light)]' : ''} hover:bg-[var(--bg-main)] transition-colors`}>
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className={`p-2 md:p-3 rounded-xl bg-[var(--bg-main)] ${mat.type === 'video' ? 'text-accent-purple' : mat.type === 'pdf' ? 'text-accent-red' : 'text-accent-orange'}`}>
                          {mat.type === 'video' ? <PlayCircle size={20} className="md:w-6 md:h-6" /> : mat.type === 'pdf' ? <FileText size={20} className="md:w-6 h-6" /> : <Book size={20} className="md:w-6 md:h-6" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm md:text-base mb-0.5 md:mb-1">{mat.title}</h4>
                          <div className="flex items-center gap-2 text-[10px] md:text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">
                            <span>{mat.chapter}</span>
                            <span>•</span>
                            <span>{mat.type === 'video' ? mat.duration : mat.type === 'pdf' ? mat.size : 'Assessment'}</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 md:px-5 md:py-2 rounded-lg border border-[var(--border-light)] text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-card)] transition-all shrink-0">
                        {mat.type === 'video' ? 'Watch' : mat.type === 'pdf' ? 'Get' : 'Start'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

            </div>

            {/* Sidebar - Right column */}
            <div>
              {/* Upcoming Classes Card */}
              <div className="card sticky top-[170px] md:top-[220px] p-5 md:p-6">
                <h3 className="flex items-center gap-2 text-lg md:text-xl font-display font-black mb-6">
                  <Calendar size={18} className="text-orange-500 md:w-5 md:h-5" /> Upcoming Classes
                </h3>
                
                {myClasses.length > 0 ? (
                  <div className="flex flex-col gap-3 md:gap-4">
                    {myClasses.map((cls) => {
                      const course = courses.find(c => c.id === cls.courseId);
                      return (
                        <div key={cls.id} className="p-4 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-2xl hover:border-orange-500/30 transition-all">
                          <div className="flex justify-between items-start mb-3">
                            <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                              {course?.subject}
                            </span>
                            <span className="text-[10px] md:text-xs font-bold text-[var(--text-muted)]">{cls.date}</span>
                          </div>
                          <h4 className="font-bold text-sm md:text-base mb-3 leading-tight">{cls.title}</h4>
                          
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border-light)]">
                            <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-[var(--text-muted)]">
                              <Clock size={12} /> {cls.time}
                            </div>
                            <Link to="/live-class" className="flex items-center gap-1.5 text-[10px] md:text-xs font-black uppercase bg-orange-500 text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-all">
                              <Video size={12} /> Join
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-[var(--text-muted)] text-xs md:text-sm italic opacity-50">No upcoming classes scheduled.</p>
                  </div>
                )}
                
                <button onClick={() => setActiveTab('schedule')} className="w-full mt-6 py-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)] text-xs font-black uppercase tracking-widest hover:bg-[var(--text-main)] hover:text-[var(--bg-card)] transition-all">Full Schedule</button>
              </div>

              {/* Questies Quick Link */}
              <div className="card mt-6 p-6 bg-gradient-to-br from-[#8a76ff]/10 to-transparent border-[#8a76ff]/20">
                <h3 className="flex items-center gap-2 text-lg font-display font-black mb-4">
                  <HelpCircle size={18} className="text-[#8a76ff]" /> Doubt Support
                </h3>
                <p className="text-xs text-[var(--text-muted)] mb-5 leading-relaxed">
                  Stuck on a problem? Ask our expert tutors and get a step-by-step solution.
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

        <div className={`flex-col lg:flex-row gap-8 ${activeTab === 'questies' ? 'flex' : 'hidden'}`}>
          <div className="lg:w-1/2">
            <h2 className="text-xl md:text-2xl font-display font-black mb-6">Ask a New Doubt</h2>
            <QuestieForm onSubmitted={() => setRefreshTrigger(prev => prev + 1)} />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-xl md:text-2xl font-display font-black mb-6">Doubt History</h2>
            <QuestieList refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {activeTab === 'my-courses' && (
          <MyCourses />
        )}

        {/* Other tabs placeholders */}
        {activeTab !== 'overview' && activeTab !== 'my-courses' && activeTab !== 'questies' && (
          <div className="card p-10 md:p-20 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-[var(--bg-main)] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[var(--text-muted)] opacity-20">
              {activeTab === 'my-courses' ? <Book size={32} /> : activeTab === 'study-materials' ? <FileText size={32} /> : <Calendar size={32} />}
            </div>
            <h2 className="text-xl md:text-2xl font-display font-black mb-3">{activeTab.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
            <p className="text-sm md:text-base text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed italic">
              This section is coming soon. We're building the best learning experience for you.
            </p>
            <button onClick={() => setActiveTab('overview')} className="mt-8 px-8 py-3 rounded-xl bg-orange-500 text-white font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">Back to Overview</button>
          </div>
        )}

      </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
