import { useAuth } from '../../shared/context/AuthContext';
import AdminDashboard from '../../features/admin/pages/AdminDashboard';
import TutorDashboard from '../../features/tutor/pages/TutorDashboard';
import StudentDashboard from '../../features/student/pages/StudentDashboard';

const Dashboard = () => {
  const { role } = useAuth();

  if (role === 'admin') {
    return <AdminDashboard />;
  }

  if (role === 'tutor') {
    return <TutorDashboard />;
  }

  return <StudentDashboard />;
};

export default Dashboard;

