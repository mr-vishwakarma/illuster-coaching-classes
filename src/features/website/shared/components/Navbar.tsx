import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { useTheme } from '../../../../shared/context/ThemeContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About Us', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Request Callback', path: '/request-callback' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2 bg-[var(--bg-card)]/90 backdrop-blur-md shadow-lg border-b border-[var(--border-light)]' 
          : 'py-3 md:py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex flex-col gap-3 md:gap-4">
        {/* Row 1: Logo & Actions */}
        <div className="flex items-center justify-between w-full">
          <Link to="/" className="transition-transform hover:scale-105 shrink-0">
            <img src="/logo.png" alt="Illuster Logo" className="h-8 md:h-10 lg:h-12 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-2 md:gap-5 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-[var(--text-main)]/10 text-[var(--text-main)] transition-colors border border-transparent hover:border-[var(--border-light)]"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={18} className="md:w-5 md:h-5" /> : <Sun size={18} className="md:w-5 md:h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2 md:gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 font-bold text-sm text-[var(--text-main)]">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--text-main)] text-[var(--bg-main)] flex items-center justify-center shadow-md text-xs md:text-sm">
                    {user?.avatar}
                  </div>
                  <span className="hidden sm:block">Dashboard</span>
                </Link>
                <button 
                  onClick={logout} 
                  className="hidden md:flex px-4 py-2 rounded-full border border-[var(--text-main)] text-[var(--text-main)] text-xs font-bold hover:bg-[var(--text-main)] hover:text-[var(--bg-main)] transition-all"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 md:gap-4">
                <Link to="/login" className="hidden sm:block text-xs md:text-sm font-bold text-[var(--text-main)] hover:text-[var(--primary)] transition-colors">
                  Log in
                </Link>
                <Link to="/login" className="bg-[var(--text-main)] text-[var(--bg-main)] hover:opacity-80 px-4 py-2 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-colors whitespace-nowrap">
                  Enroll Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Navigation Links */}
        <div className="w-full flex justify-center">
          <div className="flex items-center gap-3 sm:gap-6 md:gap-10 bg-[#111111]/80 backdrop-blur-md border border-[#2A2A2A] rounded-full px-5 sm:px-8 md:px-12 py-2.5 md:py-3.5 w-full justify-around sm:justify-center overflow-x-auto scrollbar-hide shadow-inner shadow-white/5">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[13px] sm:text-sm md:text-base font-bold whitespace-nowrap transition-all hover:scale-110 ${
                  location.pathname === link.path ? 'text-white underline underline-offset-8' : 'text-[#888888] hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

