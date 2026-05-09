import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import MouseFollower from '../shared/components/effects/MouseFollower';
import AppLayout from './AppLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Initialize stores that have side effects
import '../shared/context/AuthContext';
import '../shared/context/TrafficContext';

// ─── Scroll to top on route change ──────────────────────────────────────────
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// ─── Root App: Router shell ──────────────────────────────────────
function App() {
  return (
    <Router>
      <ScrollToTop />
      <MouseFollower />
      <AppLayout />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <SpeedInsights />
    </Router>
  );
}

export default App;
