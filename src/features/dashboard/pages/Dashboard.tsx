import { useAuth } from '../../../shared/context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import TutorDashboard from './TutorDashboard';

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

