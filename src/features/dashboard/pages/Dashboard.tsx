import { useAuth } from '../../../shared/context/AuthContext';
import AdminDashboard from '../../admin/pages/AdminDashboard';
import TutorDashboard from '../../tutor/pages/TutorDashboard';
import StudentDashboard from '../../student/pages/StudentDashboard';

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

