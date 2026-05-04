import { Link } from 'react-router-dom';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../../shared/context/ThemeContext';
import { motion } from 'framer-motion';

export const DashboardHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between items-center mb-8 border-b border-[var(--border-light)] pb-6 bg-[var(--bg-card)]/50 backdrop-blur-sm sticky top-0 z-30 pt-4">
      <div className="flex items-center gap-6">
        <Link to="/" className="hover:opacity-80 transition-all hover:scale-105 active:scale-95">
          <img src="/logo.png" alt="Illuster" className="h-8 md:h-10 w-auto" />
        </Link>
        <div className="h-6 w-px bg-[var(--border-light)] hidden md:block" />
        <Link 
          to="/" 
          className="hidden md:inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-3 rounded-2xl bg-[var(--bg-main)] hover:bg-[var(--border-light)] text-[var(--text-main)] transition-all shadow-sm flex items-center justify-center border border-[var(--border-light)]"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon size={20} className="text-indigo-600" fill="currentColor" />
          ) : (
            <Sun size={20} className="text-amber-500" fill="currentColor" />
          )}
        </motion.button>
      </div>
    </div>
  );
};
