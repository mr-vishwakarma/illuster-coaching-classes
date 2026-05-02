import { useState } from 'react';
import { Users, BookOpen, IndianRupee, AlertCircle, Plus, Edit, ArrowUpRight, ArrowDownRight, Video, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminStats } from '../';
import { courses } from '../../courses';
import { mockUsers } from '../../auth';
import { useAuth } from '../../../shared/context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const students = mockUsers.filter(u => u.role === 'student');

  return (
    <div style={{ paddingTop: '4.5rem', backgroundColor: 'var(--bg-main)', minHeight: '100vh', display: 'flex' }}>
      
      {/* Sidebar Admin Menu - Desktop */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r border-light fixed h-full z-20" style={{ top: '4.5rem', paddingTop: '2rem' }}>
        <div className="px-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-dark text-white flex items-center justify-center font-bold">
              {user?.avatar}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{user?.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administrator</div>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 px-4">
          {[
            { id: 'overview', icon: <BookOpen size={20} />, label: 'Overview' },
            { id: 'live', icon: <Video size={20} />, label: 'Live Classes' },
            { id: 'students', icon: <Users size={20} />, label: 'Student Management' },
            { id: 'courses', icon: <BookOpen size={20} />, label: 'Course Catalog' },
            { id: 'finance', icon: <IndianRupee size={20} />, label: 'Finance & Fees' }
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
            Admin Dashboard
          </h1>
          <div className="flex gap-3">
            <button className="btn btn-secondary flex items-center gap-2">
              <AlertCircle size={18} /> Notifications
            </button>
            <button className="btn btn-primary flex items-center gap-2">
              <Plus size={18} /> Add New
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {adminStats.map((stat, idx) => (
                <div key={idx} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    {stat.label}
                  </div>
                  <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                    {stat.value}
                  </div>
                  <div className="flex items-center gap-1" style={{ fontSize: '0.875rem', color: stat.positive ? 'var(--secondary)' : 'var(--accent-red)', fontWeight: 500 }}>
                    {stat.positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Recent Enrollments */}
              <div className="lg:col-span-2 card">
                <div className="flex justify-between items-center p-6 border-b border-light">
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>Recent Student Enrollments</h3>
                  <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left" style={{ minWidth: '600px' }}>
                    <thead style={{ backgroundColor: 'var(--bg-main)', color: 'var(--text-muted)', fontSize: '0.875rem', textTransform: 'uppercase' }}>
                      <tr>
                        <th className="py-3 px-6 font-semibold">Student Name</th>
                        <th className="py-3 px-6 font-semibold">Contact</th>
                        <th className="py-3 px-6 font-semibold">Join Date</th>
                        <th className="py-3 px-6 font-semibold">Courses</th>
                        <th className="py-3 px-6 font-semibold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, idx) => (
                        <tr key={student.id} style={{ borderBottom: idx !== students.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex justify-center items-center font-bold text-xs">
                                {student.avatar}
                              </div>
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{student.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-sm color-muted">{student.phone || student.email}</td>
                          <td className="py-4 px-6 text-sm">{student.joinDate}</td>
                          <td className="py-4 px-6">
                            <span className="badge" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
                              {student.enrolledCourses.length} Enrolled
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button style={{ color: 'var(--text-muted)', padding: '0.25rem' }} className="hover:text-primary">
                              <Edit size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions / Active Courses */}
              <div className="card h-max">
                <div className="p-6 border-b border-light">
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', margin: 0 }}>Course Distribution</h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    {courses.slice(0, 4).map(course => (
                      <div key={course.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{course.title}</span>
                          <span style={{ color: 'var(--text-muted)' }}>{course.enrolledCount}</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-main)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(100, (course.enrolledCount / 400) * 100)}%`, height: '100%', backgroundColor: course.color, borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button className="btn btn-outline w-full mt-6" onClick={() => setActiveTab('courses')}>
                    Manage Courses
                  </button>
                </div>
              </div>

            </div>
          </>
        )}

        {/* Live Classes Management Tab */}
        {activeTab === 'live' && (
          <div className="flex flex-col gap-8">
            <div className="card p-8">
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>Host a Live Session</h2>
              <p className="text-gray-400 mb-6">Select a batch and start broadcasting your screen to enrolled students. Students will be notified immediately.</p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-300">Select Course/Batch</label>
                  <select className="p-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white outline-none focus:border-green-500">
                    <option>3.0 Job-Ready AI Powered Cohort</option>
                    <option>JEE Physics Pro - Batch A</option>
                    <option>NEET Biology Intensive</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-300">Topic / Agenda</label>
                  <input type="text" placeholder="e.g., System Design Architecture" className="p-3 bg-[#1a1a1a] border border-white/10 rounded-lg text-white outline-none focus:border-green-500" />
                </div>
              </div>

              <Link to="/live-class" className="btn inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all">
                <PlayCircle size={20} />
                Go Live Now
              </Link>
            </div>

            {/* Scheduled Classes */}
            <div className="card p-8">
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>Upcoming Scheduled Classes</h3>
              <div className="flex flex-col gap-4">
                <div className="p-4 border border-white/10 rounded-xl bg-[#111] flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Integration by Parts — Advanced Techniques</h4>
                    <p className="text-sm text-gray-400 mt-1">JEE Mathematics Elite • Tomorrow, 7:30 PM</p>
                  </div>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
                    Edit Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholders */}
        {activeTab !== 'overview' && activeTab !== 'live' && (
          <div className="card" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--bg-main)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--text-light)' }}>
              {activeTab === 'students' ? <Users size={32} /> : activeTab === 'courses' ? <BookOpen size={32} /> : <IndianRupee size={32} />}
            </div>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
              Full CRUD interfaces for managing records would go here. Includes data tables with pagination, search, filters, and detailed view/edit modals.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;

