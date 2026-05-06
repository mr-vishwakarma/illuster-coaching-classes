import { useLocation } from 'react-router-dom';
import Navbar from '../shared/components/Navbar';
import Footer from '../shared/components/Footer';
import ErrorBoundary from '../shared/components/ErrorBoundary';
import LiveTrafficBadge from '../shared/components/LiveTrafficBadge';
import AppRoutes from './routes';

// ─── Layout wrapper with conditional Navbar/Footer ───────────────────────────
const AppLayout = () => {
  const { pathname } = useLocation();
  
  const isLiveClass = pathname.startsWith('/live-class');
  const isLogin = pathname === '/login';
  const isRequestCallback = pathname === '/request-callback';
  const isDashboard = pathname.startsWith('/dashboard');
  const isReceipt = pathname.startsWith('/receipt');

  const hideFooter = isLiveClass || isLogin || isRequestCallback || isDashboard || isReceipt;

  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      {(!isLiveClass && !isDashboard && !isReceipt) && <Navbar />}
      <main className="flex-grow">
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
        <LiveTrafficBadge />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default AppLayout;
