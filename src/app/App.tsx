import { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AuthProvider } from '../shared/context/AuthContext';
import { ThemeProvider } from '../shared/context/ThemeContext';
import MouseFollower from '../shared/components/MouseFollower';
import { TrafficProvider } from '../shared/context/TrafficContext';
import AppLayout from './AppLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

// ─── Root App: Providers + Router shell ──────────────────────────────────────
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TrafficProvider>
          <Router>
            <ScrollToTop />
            <MouseFollower />
            <AppLayout />
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
          </Router>
        </TrafficProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
