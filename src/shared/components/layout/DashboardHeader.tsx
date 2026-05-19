import { Link } from 'react-router-dom';
import { Sun, Moon, ArrowLeft, LogOut, User, Menu } from 'lucide-react';
import { useTheme } from '../../../shared/context/ThemeContext';
import { useAuth } from '../../../shared/context/AuthContext';
import { motion } from 'framer-motion';

interface DashboardHeaderProps {
  onMenuClick?: () => void;
}

export const DashboardHeader = ({ onMenuClick }: DashboardHeaderProps) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center w-full">

      {/* Left — Hamburger (Mobile) + Logo + Back */}
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl bg-[var(--bg-main)] hover:bg-[var(--border-light)] text-[var(--text-main)] transition-all shadow-sm border border-[var(--border-light)]"
          >
            <Menu size={20} />
          </button>
        )}
        <Link to="/" className="hover:opacity-80 transition-all hover:scale-105 active:scale-95 shrink-0">
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

      {/* Right — Theme + User + Logout */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-[var(--bg-main)] hover:bg-[var(--border-light)] text-[var(--text-main)] transition-all shadow-sm flex items-center justify-center border border-[var(--border-light)]"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-indigo-600" fill="currentColor" />
          ) : (
            <Sun size={18} className="text-amber-500" fill="currentColor" />
          )}
        </motion.button>

        {/* User chip — desktop only */}
        {user && (
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-light)]">
            <div className="w-6 h-6 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold text-xs shrink-0">
              {user.avatar || <User size={12} />}
            </div>
            <span className="text-xs font-semibold text-[var(--text-main)] max-w-[120px] truncate">
              {user.name}
            </span>
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] capitalize">
              {user.role}
            </span>
          </div>
        )}

        {/* Logout button — always visible */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-black uppercase tracking-widest transition-all border border-red-500/20 hover:border-red-500"
          title="Logout"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </motion.button>

      </div>
    </div>
  );
};
