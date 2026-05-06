import { useState } from 'react';
import { Users, BookOpen, AlertCircle, Video, PlayCircle, HelpCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../shared/context/AuthContext';
import { QuestieAdminList } from '../../questies/components/QuestieAdminList';
import { DashboardHeader } from '../components/DashboardHeader';
import { supabase } from '../../../shared/lib/supabase';
import { toast } from 'react-toastify';

const TutorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Live Class Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [batch, setBatch] = useState('Batch A - AI Cohort');
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="bg-[var(--bg-main)] min-h-screen flex flex-col">
      {/* Fixed Top Navbar */}
      <div className="fixed top-0 left-0 right-0 h-[4.5rem] bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-light)] z-50 px-6 lg:px-10 flex items-center">
        <DashboardHeader />
      </div>

      <div className="flex flex-1 pt-[4.5rem]">
        {/* Sidebar Tutor Menu */}
        <div className="hidden lg:flex flex-col w-64 bg-[var(--bg-card)] border-r border-[var(--border-light)] fixed h-[calc(100vh-4.5rem)] z-20 overflow-y-auto pb-6" style={{ top: '4.5rem', paddingTop: '2rem' }}>
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8a76ff] text-white flex items-center justify-center font-bold">
              {user?.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expert Tutor</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {[
            { id: 'overview', icon: <BookOpen size={20} />, label: 'Overview' },
            { id: 'live', icon: <Video size={20} />, label: 'My Live Classes' },
            { id: 'questies', icon: <HelpCircle size={20} />, label: 'Doubt Portal' },
            { id: 'students', icon: <Users size={20} />, label: 'My Students' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="flex items-center gap-3 w-full text-left"
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: activeTab === item.id ? 'var(--primary-light)' : 'transparent',
                color: activeTab === item.id ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeTab === item.id ? 600 : 500,
                transition: 'all 0.2s'
              }}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-6 lg:p-10">

        <div className="flex justify-between items-center mb-8">
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', margin: 0, color: 'var(--text-main)' }}>
            Tutor Dashboard
          </h1>
          <div className="flex gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <AlertCircle size={18} /> Announcements
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="card p-8 bg-gradient-to-br from-[#8a76ff]/5 to-transparent border-[#8a76ff]/20">
              <h2 className="text-xl font-display font-black mb-4">Welcome back, Prof. {user?.name.split(' ')[0]}</h2>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                You have 4 doubts pending in the portal and your next live class starts in 2 hours.
              </p>
              <button onClick={() => setActiveTab('questies')} className="btn btn-primary px-8">Solve Doubts Now</button>
            </div>
            
            <div className="card p-8">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-[var(--text-muted)] opacity-60 uppercase text-[10px] tracking-widest">
                <Video size={14} /> Quick Link
              </h3>
              <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-between p-4 bg-[var(--bg-main)] rounded-xl hover:bg-[var(--primary-light)] transition-all border border-[var(--border-light)]">
                <div className="font-bold text-[var(--text-main)] text-sm">Start Teaching (Live)</div>
                <PlayCircle className="text-red-600" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'questies' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-display font-black text-[var(--text-main)]">Doubt Portal</h2>
              <p className="text-sm text-[var(--text-muted)]">Provide expert solutions to your assigned students.</p>
            </div>
            <QuestieAdminList />
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'overview' && activeTab !== 'questies' && (
          <div className="card p-20 text-center">
            <h2 className="text-xl font-display font-black mb-4 capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-[var(--text-muted)] italic">This section is being customized for your tutoring workflow.</p>
          </div>
        )}

      </div>
      {/* Create Live Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-display font-black mb-6 text-[var(--text-main)]">Start a Live Class</h2>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsCreating(true);
              
              // Check if already active
              const { data: existingActive } = await supabase
                .from('live_sessions')
                .select('id')
                .eq('tutor_id', user?.id)
                .eq('status', 'live')
                .maybeSingle();
                
              if (existingActive) {
                toast.info("You already have an active class. Resuming it instead!");
                setIsCreating(false);
                navigate(`/live-class/${existingActive.id}`);
                return;
              }
              
              const { data, error } = await supabase
                .from('live_sessions')
                .insert({
                  title,
                  batch,
                  tutor_id: user?.id,
                  status: 'live'
                })
                .select()
                .single();
                
              setIsCreating(false);
              
              if (error) {
                toast.error("Failed to start session.");
                console.error(error);
              } else {
                toast.success("Class is live!");
                navigate(`/live-class/${data.id}`);
              }
            }} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Class Topic</label>
                <input 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g., System Design Architecture" 
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Select Batch</label>
                <select 
                  value={batch}
                  onChange={e => setBatch(e.target.value)}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)] text-[var(--text-main)]"
                >
                  <option value="Batch A - AI Cohort">Batch A - AI Cohort</option>
                  <option value="Batch B - Frontend Masters">Batch B - Frontend Masters</option>
                  <option value="All Students">All Students</option>
                </select>
              </div>
              <button 
                type="submit" 
                disabled={isCreating}
                className="btn btn-primary w-full mt-4 flex justify-center items-center gap-2"
              >
                {isCreating ? 'Creating...' : <><Video size={18} /> Go Live Now</>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
    </div>
  );
};

export default TutorDashboard;
