import { useLocation } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import AppRoutes from './routes';
import { useAuth } from '../shared/context/AuthContext';

// ─── Layout wrapper with conditional Navbar/Footer ───────────────────────────
const AppLayout = () => {
  const { pathname } = useLocation();
  
  const isLiveClass = pathname === '/live-class';
  const isLogin = pathname === '/login';
  const isRequestCallback = pathname === '/request-callback';
  const isDashboard = pathname.startsWith('/dashboard');

  const hideFooter = isLiveClass || isLogin || isRequestCallback || isDashboard;

  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      {(!isLiveClass && !isDashboard) && <Navbar />}
      <main className="flex-grow">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default AppLayout;
