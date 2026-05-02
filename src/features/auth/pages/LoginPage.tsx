import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowRight, User, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../shared/context/AuthContext';

const Login = () => {
  const [role, setRole] = useState<'student' | 'tutor' | 'admin'>('student');
  const [email, setEmail] = useState('student@illuster.com');
  const [password, setPassword] = useState('student123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Update mock credentials when role changes for easy testing
  useEffect(() => {
    if (role === 'admin') {
      setEmail('admin@illuster.com');
      setPassword('admin123');
    } else if (role === 'tutor') {
      setEmail('tutor@illuster.com');
      setPassword('tutor123');
    } else {
      setEmail('student@illuster.com');
      setPassword('student123');
    }
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Login failed');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-bold">Back</span>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link to="/" className="hover:scale-105 transition-transform">
            <img src="/logo.png" alt="Illuster Logo" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 p-10 md:p-14 shadow-2xl relative">
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-display font-black text-white mb-3 tracking-tight">Portal Sign In</h2>
            <p className="text-white/50 font-medium italic">Access your personalized learning dashboard</p>
          </div>

          {/* Role Toggle */}
          <div className="flex p-1.5 bg-[#111] rounded-2xl mb-10 border border-white/5">
            <button 
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${role === 'student' ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white/80'}`}
            >
              <User size={14} /> Student
            </button>
            <button 
              onClick={() => setRole('tutor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${role === 'tutor' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white/80'}`}
            >
              <User size={14} /> Tutor
            </button>
            <button 
              onClick={() => setRole('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${role === 'admin' ? 'bg-orange-500 text-white shadow-lg' : 'text-white/40 hover:text-white/80'}`}
            >
              <ShieldCheck size={14} /> Admin
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-500/10 text-red-500 p-4 rounded-2xl mb-8 flex items-center gap-3 text-sm font-bold border border-red-500/20"
            >
              <AlertCircle size={20} className="shrink-0" /> {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-[#0d0d0d] text-white focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-lg"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2" htmlFor="password">Password</label>
                <a href="#" className="text-[10px] font-black text-orange-500 hover:underline tracking-widest">Forgot?</a>
              </div>
              <input
                id="password"
                type="password"
                className="w-full px-6 py-4 rounded-2xl border border-white/10 bg-[#0d0d0d] text-white focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 transition-all text-lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-5 bg-white text-black hover:bg-orange-500 hover:text-white rounded-2xl text-xl font-black shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-4 mt-8" 
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : `Access ${role === 'admin' ? 'Tutor' : 'Student'} Panel`} 
              <ArrowRight size={24} />
            </button>
          </form>

          {/* Sandbox Credentials Hint */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="mb-4 font-black text-orange-500 uppercase tracking-[0.2em] text-[10px]">Sandbox Credentials</p>
            <div className="flex flex-col gap-1 text-xs font-bold text-white/40">
              <span>{email}</span>
              <span>{password}</span>
            </div>
          </div>
        </div>

        <p className="text-center mt-10 text-white/40 font-medium">
          New here? <Link to="/#contact" className="text-white hover:text-orange-500 transition-colors underline decoration-white/20 underline-offset-4 ml-1">Contact Admissions</Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Login;
