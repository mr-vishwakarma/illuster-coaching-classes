import { useState } from 'react';
import {
  Users, BookOpen, IndianRupee, AlertCircle, Plus,
  Edit, ArrowUpRight, ArrowDownRight, PlayCircle,
  Database, HelpCircle, BarChart3, ChevronRight, Radio, Shield
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { adminStats } from '../';
import { CourseManager } from '../components/CourseManager';
import { StudentDirectory } from '../components/StudentDirectory';
import { EnrollmentManager } from '../components/EnrollmentManager';
import { FinanceManager } from '../components/FinanceManager';
import { mockUsers } from '../../auth';
import { useAuth } from '../../../shared/context/AuthContext';
import { QuestieAdminList } from '../../questies/components/QuestieAdminList';
import { DashboardHeader } from '../components/DashboardHeader';
import { DatabaseHealth } from '../components/DatabaseHealth';
import MobileBottomNav from '../components/MobileBottomNav';
import { DashboardTour } from '../components/DashboardTour';

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({
  label, value, change, positive, icon, color
}: {
  label: string; value: string | number; change: string;
  positive: boolean; icon: React.ReactNode; color: string;
}) => (
  <div className="card p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
      <div className="p-2 rounded-lg" style={{ background: `${color}18` }}>
        <div style={{ color }}>{icon}</div>
      </div>
    </div>
    <div className="text-2xl font-display font-black text-[var(--text-main)]">{value}</div>
    <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-green-500' : 'text-red-400'}`}>
      {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {change}
    </div>
  </div>
);

// ─── Section Header ───────────────────────────────────────────
const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-5">
    <h2 className="text-xl md:text-2xl font-display font-black text-[var(--text-main)]">{title}</h2>
    {sub && <p className="text-sm text-[var(--text-muted)] mt-0.5">{sub}</p>}
  </div>
);

// ─── Main Component ───────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const students = mockUsers.filter(u => u.role === 'student');

  const navItems = [
    { id: 'overview',  icon: <BarChart3 size={18} />,    label: 'Overview' },
    { id: 'live',      icon: <Radio size={18} />,         label: 'Live' },
    { id: 'students',  icon: <Users size={18} />,         label: 'Students' },
    { id: 'courses',   icon: <BookOpen size={18} />,      label: 'Courses' },
    { id: 'questies',  icon: <HelpCircle size={18} />,    label: 'Doubts' },
    { id: 'finance',   icon: <IndianRupee size={18} />,   label: 'Finance' },
    { id: 'health',    icon: <Database size={18} />,      label: 'Health' },
  ];

  // Map adminStats to stat cards (inject icons + colors)
  const statColors = ['#8a76ff', '#10b981', '#f59e0b', '#ef4444'];
  const statIcons = [<Users size={18} />, <BookOpen size={18} />, <IndianRupee size={18} />, <AlertCircle size={18} />];

  return (
    <div className="bg-[var(--bg-main)] min-h-screen flex flex-col">

      {/* Fixed Navbar */}
      <div className="tour-dashboard-header fixed top-0 left-0 right-0 h-[4.5rem] bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-light)] z-50 px-6 lg:px-10 flex items-center">
        <DashboardHeader />
      </div>

      <div className="flex flex-1 pt-[4.5rem]">

        {/* Sidebar — Desktop Only */}
        <div className="hidden lg:flex flex-col w-64 bg-[var(--bg-card)] border-r border-[var(--border-light)] fixed h-[calc(100vh-4.5rem)] z-20 overflow-y-auto pb-6" style={{ top: '4.5rem' }}>

          {/* Admin Profile */}
          <div className="px-5 py-6 border-b border-[var(--border-light)]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                {user?.avatar}
              </div>
              <div>
                <div className="font-bold text-sm text-[var(--text-main)] truncate max-w-[130px]">{user?.name}</div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold flex items-center gap-1">
                  <Shield size={10} className="text-[var(--primary)]" /> Administrator
                </div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 px-3 pt-4">
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
                {activeTab === item.id && <ChevronRight size={14} />}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 p-5 lg:p-8 pb-24 lg:pb-8">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">

              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-display font-black text-[var(--text-main)]">Admin Dashboard</h1>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Platform-wide management and insights.</p>
                </div>
                <div className="flex gap-2 self-start sm:self-auto">
                  <button className="btn btn-secondary flex items-center gap-2 text-sm">
                    <AlertCircle size={16} /> Notify All
                  </button>
                  <button className="btn btn-primary flex items-center gap-2 text-sm" onClick={() => setActiveTab('students')}>
                    <Plus size={16} /> Add Student
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 tour-stats">
                {adminStats.map((stat, idx) => (
                  <StatCard
                    key={idx}
                    label={stat.label}
                    value={stat.value}
                    change={stat.change}
                    positive={stat.positive}
                    icon={statIcons[idx % 4]}
                    color={statColors[idx % 4]}
                  />
                ))}
              </div>

              {/* Pending Approvals */}
              <div className="tour-enrollments">
                <SectionHeader title="Pending Approvals" sub="Review and verify new enrollment requests." />
                <EnrollmentManager />
              </div>

              {/* Recent Enrollments + Batches */}
              <div className="grid lg:grid-cols-3 gap-6">

                {/* Student Table */}
                <div className="lg:col-span-2 card overflow-hidden tour-recent-students">
                  <div className="flex justify-between items-center p-5 border-b border-[var(--border-light)]">
                    <h3 className="text-base font-display font-black text-[var(--text-main)]">Recent Enrollments</h3>
                    <button onClick={() => setActiveTab('students')} className="text-[var(--primary)] text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                      View All <ChevronRight size={12} />
                    </button>
                  </div>
                  {/* Scrollable on mobile */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left" style={{ minWidth: '540px' }}>
                      <thead className="bg-[var(--bg-main)] text-[var(--text-muted)] text-xs uppercase tracking-widest">
                        <tr>
                          <th className="py-3 px-5 font-semibold">Student</th>
                          <th className="py-3 px-5 font-semibold">Contact</th>
                          <th className="py-3 px-5 font-semibold">Courses</th>
                          <th className="py-3 px-5 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-light)]">
                        {students.slice(0, 5).map(student => (
                          <tr key={student.id} className="hover:bg-[var(--bg-main)] transition-colors">
                            <td className="py-3 px-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex justify-center items-center font-bold text-xs shrink-0">
                                  {student.avatar}
                                </div>
                                <span className="font-semibold text-sm text-[var(--text-main)]">{student.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-5 text-xs text-[var(--text-muted)]">{student.phone || student.email}</td>
                            <td className="py-3 px-5">
                              <span className="text-[10px] font-black uppercase tracking-widest bg-[var(--primary-light)] text-[var(--primary)] px-2 py-1 rounded-lg">
                                {student.enrolledCourses.length} Enrolled
                              </span>
                            </td>
                            <td className="py-3 px-5 text-right">
                              <button className="p-1.5 text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors rounded-lg hover:bg-[var(--primary-light)]">
                                <Edit size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Active Batches */}
                <div className="card p-5 h-max tour-batches">
                  <h3 className="text-base font-display font-black text-[var(--text-main)] mb-4">Active Batches</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { name: 'Batch A — JEE Elite', students: 45, progress: 75 },
                      { name: 'Batch B — NEET Pro', students: 38, progress: 60 },
                      { name: 'Batch C — Board Prep', students: 22, progress: 40 },
                    ].map(batch => (
                      <div key={batch.name} className="p-3 bg-[var(--bg-main)] rounded-xl border border-[var(--border-light)]">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">
                          <span>{batch.name}</span>
                          <span>{batch.students} Students</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--border-light)] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--primary)] rounded-full transition-all"
                            style={{ width: `${batch.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-outline w-full mt-4 text-xs"
                    onClick={() => setActiveTab('courses')}
                  >
                    Manage Courses
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ── LIVE TAB ── */}
          {activeTab === 'live' && (
            <div className="flex flex-col gap-6">
              <SectionHeader title="Live Classes" sub="Monitor all active sessions across batches." />
              <div className="card p-6">
                <h3 className="font-display font-black text-lg text-[var(--text-main)] mb-2">Host a Live Session</h3>
                <p className="text-sm text-[var(--text-muted)] mb-5">Select a batch and start broadcasting to enrolled students immediately.</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Select Batch</label>
                    <select className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]">
                      <option>Batch A — JEE Elite</option>
                      <option>Batch B — NEET Pro</option>
                      <option>All Students</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2">Session Topic</label>
                    <input
                      type="text"
                      placeholder="e.g., System Design Architecture"
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)]"
                    />
                  </div>
                </div>
                <Link
                  to="/live-class"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-red-600/20 transition-all"
                >
                  <PlayCircle size={16} /> Go Live Now
                </Link>
              </div>
            </div>
          )}

          {/* ── STUDENTS TAB ── */}
          {activeTab === 'students' && (
            <div className="flex flex-col gap-6">
              <SectionHeader title="Student Directory" sub="Manage student records and batch assignments." />
              <div className="overflow-x-auto">
                <StudentDirectory />
              </div>
            </div>
          )}

          {/* ── COURSES TAB ── */}
          {activeTab === 'courses' && (
            <div className="flex flex-col gap-6">
              <SectionHeader
                title="Course Management"
                sub={user?.role === 'admin' ? 'Create, edit and manage coaching programs.' : 'View current programs and batches.'}
              />
              {user?.role === 'admin' ? (
                <CourseManager />
              ) : (
                <div className="card p-12 text-center">
                  <BookOpen size={36} className="mx-auto text-[var(--text-muted)] opacity-20 mb-4" />
                  <h3 className="font-display font-black text-lg mb-2 text-[var(--text-main)]">Restricted Access</h3>
                  <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">Only admins can modify the course catalog.</p>
                </div>
              )}
            </div>
          )}

          {/* ── DOUBTS TAB ── */}
          {activeTab === 'questies' && (
            <div className="flex flex-col gap-6">
              <SectionHeader title="Doubt Portal" sub="Review and resolve student academic questions." />
              <QuestieAdminList />
            </div>
          )}

          {/* ── FINANCE TAB ── */}
          {activeTab === 'finance' && (
            <div className="flex flex-col gap-6">
              <SectionHeader title="Finance & Fee Ledger" sub="Record payments and manage outstanding balances." />
              <div className="overflow-x-auto">
                <FinanceManager />
              </div>
            </div>
          )}

          {/* ── SYSTEM HEALTH TAB ── */}
          {activeTab === 'health' && (
            <div className="flex flex-col gap-6">
              <SectionHeader title="System Health" sub="Monitor database and service status." />
              <DatabaseHealth />
            </div>
          )}

        </div>
      </div>

      <MobileBottomNav
        tabs={navItems}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <DashboardTour role="admin" />
    </div>
  );
};

export default AdminDashboard;
