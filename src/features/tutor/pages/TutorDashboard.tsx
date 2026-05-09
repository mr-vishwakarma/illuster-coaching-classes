import { useState, useEffect } from 'react';
import { 
  Users, HelpCircle, BarChart3, Radio,
  Calendar, ChevronRight, PlayCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { QuestieAdminList } from '../../collaboration/questies/components/QuestieAdminList';
import { DashboardHeader } from '../../../shared/components/layout/DashboardHeader';
import { supabase } from '../../../shared/lib/supabase';
import { toast } from 'react-toastify';
import MobileBottomNav from '../../../shared/components/layout/MobileBottomNav';
import { DashboardTour } from '../../../shared/components/layout/DashboardTour';
import { TutorStats } from '../components/TutorStats';
import { SessionList } from '../components/SessionList';
import { StartClassModal } from '../components/StartClassModal';

const TutorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [batch, setBatch] = useState('Batch A - AI Cohort');
  const [isCreating, setIsCreating] = useState(false);

  // Live sessions state
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [pastSessions, setPastSessions] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalSessions: 0, totalStudents: 0, pendingDoubts: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [{ data: live }, { data: ended }, { data: doubts }] = await Promise.all([
          supabase.from('live_sessions').select('*').eq('tutor_id', user.id).eq('status', 'live').order('created_at', { ascending: false }),
          supabase.from('live_sessions').select('*').eq('tutor_id', user.id).eq('status', 'ended').order('created_at', { ascending: false }).limit(5),
          supabase.from('questies').select('id', { count: 'exact' }).eq('status', 'pending'),
        ]);
        setActiveSessions(live || []);
        setPastSessions(ended || []);
        setStats({
          totalSessions: (live?.length || 0) + (ended?.length || 0),
          totalStudents: 0,
          pendingDoubts: doubts?.length || 0,
        });
      } catch (err) {
        console.error('Error fetching tutor data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  const handleEndSession = async (id: string) => {
    if (!window.confirm('End this session? Students will be disconnected.')) return;
    await supabase.from('live_sessions').update({ status: 'ended' }).eq('id', id);
    setActiveSessions(prev => prev.filter(s => s.id !== id));
    toast.success('Session ended.');
  };

  const handleStartClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const { data: existing } = await supabase
      .from('live_sessions').select('id').eq('tutor_id', user?.id).eq('status', 'live').maybeSingle();

    if (existing) {
      toast.info('You already have an active class. Resuming it!');
      setIsCreating(false);
      setIsModalOpen(false);
      navigate(`/live-class/${existing.id}`);
      return;
    }

    const { data, error } = await supabase
      .from('live_sessions')
      .insert({ title, batch, tutor_id: user?.id, status: 'live' })
      .select().single();

    setIsCreating(false);
    if (error) { toast.error('Failed to start session.'); return; }
    toast.success('Class is live! 🎙️');
    setIsModalOpen(false);
    navigate(`/live-class/${data.id}`);
  };

  const navItems = [
    { id: 'overview',  icon: <BarChart3 size={18} />,   label: 'Overview' },
    { id: 'live',      icon: <Radio size={18} />,        label: 'Live' },
    { id: 'questies',  icon: <HelpCircle size={18} />,   label: 'Doubts', badge: stats.pendingDoubts },
    { id: 'students',  icon: <Users size={18} />,        label: 'Students' },
    { id: 'schedule',  icon: <Calendar size={18} />,     label: 'Schedule' },
  ];

  return (
    <div className="bg-[var(--bg-main)] min-h-screen flex flex-col">
      <div className="tour-dashboard-header fixed top-0 left-0 right-0 h-[4.5rem] bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-light)] z-50 px-6 lg:px-10 flex items-center">
        <DashboardHeader />
      </div>

      <div className="flex flex-1 pt-[4.5rem]">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 bg-[var(--bg-card)] border-r border-[var(--border-light)] fixed h-[calc(100vh-4.5rem)] z-20 overflow-y-auto pb-6" style={{ top: '4.5rem' }}>
          <div className="px-5 py-6 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#8a76ff] to-[#6c5ce7] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                {user?.avatar}
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-main)] truncate max-w-[130px]">{user?.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Expert Tutor
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pt-4 pb-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
            >
              Go Live
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-3 pt-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === item.id
                    ? 'bg-[var(--primary-light)] text-[var(--primary)]'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]'
                }`}
              >
                <span className="flex items-center gap-3">{item.icon}{item.label}</span>
                {item.badge ? (
                  <span className="text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{item.badge}</span>
                ) : (
                  activeTab === item.id && <ChevronRight size={14} />
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 p-5 lg:p-8 pb-24 lg:pb-8">
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-display font-black text-[var(--text-main)]">
                    Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name.split(' ')[0]} 👋
                  </h1>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Here's what's happening in your classes today.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <PlayCircle size={18} /> Start Live Class
                </button>
              </div>

              <TutorStats 
                activeSessionsCount={activeSessions.length} 
                totalSessions={stats.totalSessions} 
                pendingDoubts={stats.pendingDoubts} 
              />

              <SessionList 
                activeSessions={activeSessions} 
                pastSessions={pastSessions} 
                isLoading={isLoading} 
                onResume={(id) => navigate(`/live-class/${id}`)} 
                onEnd={handleEndSession} 
              />
            </div>
          )}

          {activeTab === 'live' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-black text-[var(--text-main)]">Live Classes</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center gap-2">
                  <PlayCircle size={16} /> Start New Class
                </button>
              </div>
              
              <SessionList 
                activeSessions={activeSessions} 
                pastSessions={pastSessions} 
                isLoading={isLoading} 
                onResume={(id) => navigate(`/live-class/${id}`)} 
                onEnd={handleEndSession} 
              />
            </div>
          )}

          {activeTab === 'questies' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-display font-black text-[var(--text-main)]">Doubt Portal</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">Review and answer pending questions from your students.</p>
              </div>
              <QuestieAdminList />
            </div>
          )}

          {!['overview', 'live', 'questies'].includes(activeTab) && (
            <div className="card p-16 text-center">
              <h2 className="text-xl font-display font-black mb-2 capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-sm text-[var(--text-muted)] italic max-w-xs mx-auto">This section is being built for your workflow. Check back soon!</p>
            </div>
          )}
        </div>
      </div>

      <StartClassModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleStartClass}
        title={title}
        setTitle={setTitle}
        batch={batch}
        setBatch={setBatch}
        isCreating={isCreating}
      />
      
      <DashboardTour role="tutor" />
      <MobileBottomNav
        tabs={navItems.map(n => ({ id: n.id, icon: n.icon, label: n.label, badge: n.badge }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
};

export default TutorDashboard;
