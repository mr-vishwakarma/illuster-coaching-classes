import { useState, useEffect } from 'react';
import { 
  Users, BookOpen, Video, PlayCircle, HelpCircle, X, 
  BarChart3, Clock, CheckCircle2, Radio, TrendingUp,
  Calendar, ChevronRight, Mic, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { QuestieAdminList } from '../../questies/components/QuestieAdminList';
import { DashboardHeader } from '../components/DashboardHeader';
import { supabase } from '../../../shared/lib/supabase';
import { toast } from 'react-toastify';

// ─── Stat Card ───────────────────────────────────────────────
const StatCard = ({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string }) => (
  <div className={`card p-5 flex items-start gap-4 border-l-4`} style={{ borderLeftColor: color }}>
    <div className="p-2.5 rounded-xl" style={{ background: `${color}18` }}>
      <div style={{ color }}>{icon}</div>
    </div>
    <div>
      <div className="text-2xl font-display font-black text-[var(--text-main)]">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-[var(--text-muted)] mt-1 opacity-60">{sub}</div>}
    </div>
  </div>
);

// ─── Session Row ──────────────────────────────────────────────
const SessionRow = ({ session, onResume, onEnd }: { session: any; onResume: () => void; onEnd: () => void }) => (
  <div className="flex items-center justify-between p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-light)] hover:border-red-500/30 transition-all">
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
      <div>
        <div className="font-bold text-sm text-[var(--text-main)]">{session.title}</div>
        <div className="text-xs text-[var(--text-muted)]">{session.batch} · Started {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onResume} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-black uppercase tracking-widest hover:bg-green-500/20 transition-all">Resume</button>
      <button onClick={onEnd} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">End</button>
    </div>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────
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
      setIsLoading(false);
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
    { id: 'live',      icon: <Radio size={18} />,        label: 'Live Classes' },
    { id: 'questies',  icon: <HelpCircle size={18} />,   label: 'Doubt Portal', badge: stats.pendingDoubts },
    { id: 'students',  icon: <Users size={18} />,        label: 'My Students' },
    { id: 'schedule',  icon: <Calendar size={18} />,     label: 'Schedule' },
  ];

  return (
    <div className="bg-[var(--bg-main)] min-h-screen flex flex-col">

      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 h-[4.5rem] bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-light)] z-50 px-6 lg:px-10 flex items-center">
        <DashboardHeader />
      </div>

      <div className="flex flex-1 pt-[4.5rem]">

        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-64 bg-[var(--bg-card)] border-r border-[var(--border-light)] fixed h-[calc(100vh-4.5rem)] z-20 overflow-y-auto pb-6" style={{ top: '4.5rem' }}>
          {/* Tutor Profile */}
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

          {/* Go Live CTA */}
          <div className="px-4 pt-4 pb-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
            >
              <Mic size={14} /> Go Live
            </button>
          </div>

          {/* Nav */}
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
        <div className="flex-1 lg:ml-64 p-5 lg:p-8">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              {/* Header */}
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

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Radio size={20} />} label="Active Sessions" value={activeSessions.length} sub="Currently live" color="#ef4444" />
                <StatCard icon={<BookOpen size={20} />} label="Total Sessions" value={stats.totalSessions} sub="All time" color="#8a76ff" />
                <StatCard icon={<HelpCircle size={20} />} label="Pending Doubts" value={stats.pendingDoubts} sub="Need your answer" color="#f59e0b" />
                <StatCard icon={<TrendingUp size={20} />} label="Students" value="—" sub="Across all batches" color="#10b981" />
              </div>

              {/* Active Sessions */}
              {activeSessions.length > 0 && (
                <div className="card p-5 border-red-500/20">
                  <h2 className="text-sm font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Currently Live
                  </h2>
                  <div className="flex flex-col gap-2">
                    {activeSessions.map(s => (
                      <SessionRow
                        key={s.id}
                        session={s}
                        onResume={() => navigate(`/live-class/${s.id}`)}
                        onEnd={() => handleEndSession(s.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Sessions */}
              <div className="card p-5">
                <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
                  <Clock size={14} /> Recent Sessions
                </h2>
                {isLoading ? (
                  <div className="text-center py-8 text-[var(--text-muted)] text-sm italic">Loading...</div>
                ) : pastSessions.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {pastSessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-main)] transition-colors">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-[var(--text-main)]">{s.title}</div>
                            <div className="text-xs text-[var(--text-muted)]">{s.batch} · {new Date(s.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">Ended</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Video size={32} className="mx-auto text-[var(--text-muted)] opacity-20 mb-3" />
                    <p className="text-sm text-[var(--text-muted)] italic">No sessions yet. Start your first live class!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── LIVE TAB ── */}
          {activeTab === 'live' && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-black text-[var(--text-main)]">Live Classes</h2>
                <button onClick={() => setIsModalOpen(true)} className="btn btn-primary flex items-center gap-2">
                  <PlayCircle size={16} /> Start New Class
                </button>
              </div>
              {activeSessions.length > 0 ? (
                <div className="card p-5 border-red-500/20">
                  <h3 className="text-xs font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Active Now
                  </h3>
                  <div className="flex flex-col gap-2">
                    {activeSessions.map(s => (
                      <SessionRow key={s.id} session={s} onResume={() => navigate(`/live-class/${s.id}`)} onEnd={() => handleEndSession(s.id)} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="card p-16 text-center">
                  <Radio size={40} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                  <h3 className="font-display font-black text-xl mb-2">No active classes</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-6">Start a live class to begin teaching your students in real-time.</p>
                  <button onClick={() => setIsModalOpen(true)} className="btn btn-primary mx-auto flex items-center gap-2">
                    <Mic size={16} /> Go Live Now
                  </button>
                </div>
              )}

              {/* Past sessions */}
              {pastSessions.length > 0 && (
                <div className="card p-5">
                  <h3 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-3">Past Sessions</h3>
                  <div className="flex flex-col gap-2">
                    {pastSessions.map(s => (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-main)] transition-colors border border-transparent hover:border-[var(--border-light)]">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-[var(--text-main)]">{s.title}</div>
                            <div className="text-xs text-[var(--text-muted)]">{s.batch} · {new Date(s.created_at).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase bg-green-500/10 text-green-400 px-2 py-1 rounded-lg">Ended</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── DOUBTS TAB ── */}
          {activeTab === 'questies' && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-display font-black text-[var(--text-main)]">Doubt Portal</h2>
                <p className="text-sm text-[var(--text-muted)] mt-1">Review and answer pending questions from your students.</p>
              </div>
              <QuestieAdminList />
            </div>
          )}

          {/* ── PLACEHOLDER TABS ── */}
          {!['overview', 'live', 'questies'].includes(activeTab) && (
            <div className="card p-16 text-center">
              <AlertCircle size={36} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
              <h2 className="text-xl font-display font-black mb-2 capitalize">{activeTab.replace('-', ' ')}</h2>
              <p className="text-sm text-[var(--text-muted)] italic max-w-xs mx-auto">This section is being built for your workflow. Check back soon!</p>
            </div>
          )}

        </div>
      </div>

      {/* ── GO LIVE MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-red-500/10">
                <Mic size={20} className="text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-display font-black text-[var(--text-main)]">Start a Live Class</h2>
                <p className="text-xs text-[var(--text-muted)]">Students will see a live banner on their dashboard</p>
              </div>
            </div>

            <form onSubmit={handleStartClass} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Class Topic *</label>
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., System Design Architecture"
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Select Batch</label>
                <select
                  value={batch}
                  onChange={e => setBatch(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)] transition-colors"
                >
                  <option value="Batch A - AI Cohort">Batch A — AI Cohort</option>
                  <option value="Batch B - Frontend Masters">Batch B — Frontend Masters</option>
                  <option value="All Students">All Students</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full mt-2 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20"
              >
                {isCreating ? 'Starting...' : <><Mic size={16} /> Go Live Now</>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TutorDashboard;
