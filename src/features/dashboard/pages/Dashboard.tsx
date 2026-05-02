import { useAuth } from '../../../shared/context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { role } = useAuth();

  if (role === 'admin' || role === 'tutor') {
    return <AdminDashboard />;
  }

  return <StudentDashboard />;
};

export default Dashboard;

