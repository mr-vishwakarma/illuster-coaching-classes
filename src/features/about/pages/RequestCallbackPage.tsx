import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, User, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const RequestCallback = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 md:p-6 text-white pt-20 md:pt-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-3xl md:rounded-[3rem] text-center max-w-lg w-full relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
          <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8 text-green-500 border border-green-500/20">
            <CheckCircle2 size={32} className="md:w-10 md:h-10" />
          </div>
          <h2 className="text-2xl md:text-4xl font-display font-black mb-3 md:mb-4 tracking-tight text-white">Request Received!</h2>
          <p className="text-white/50 text-base md:text-lg leading-relaxed mb-8 md:mb-10">Our academic counselors will call you within <span className="text-white font-bold italic">24 working hours</span>. Keep your phone handy!</p>
          <Link to="/" className="inline-flex items-center justify-center px-8 py-3.5 md:px-10 md:py-4 bg-white text-black font-black rounded-xl md:rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-xl text-sm md:text-base">
            Return to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30 pt-28 md:pt-32 pb-14 md:pb-20 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        
        <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
          
          {/* Left Side Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-8 transition-colors group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back
            </Link>
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-black mb-4 md:mb-8 tracking-tight leading-[1.1]">
              Your Journey <br />
              <span className="text-orange-500">Starts with a Call.</span>
            </h1>
            <p className="text-base md:text-xl text-white/50 mb-8 md:mb-12 leading-relaxed font-medium">
              Have doubts about batches or fees? Get a free consultation from our expert academic mentors.
            </p>

            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 md:gap-5 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Phone size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base md:text-lg text-white">Direct Support</h4>
                  <p className="text-xs md:text-sm text-white/40">+91 98765 43210</p>
                </div>
              </div>
              <div className="flex items-center gap-4 md:gap-5 p-4 md:p-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Mail size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-base md:text-lg text-white">Email Us</h4>
                  <p className="text-xs md:text-sm text-white/40">admissions@illuster.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a0a0a] rounded-[2rem] md:rounded-[3rem] border border-white/10 p-6 md:p-12 shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 p-4 md:p-8 text-orange-500/10 text-7xl md:text-9xl font-black pointer-events-none select-none">
              ?
            </div>
            
            <h2 className="text-2xl md:text-3xl font-display font-black mb-1 md:mb-2 tracking-tight">Request Callback</h2>
            <p className="text-xs md:text-sm text-white/40 font-medium italic mb-6 md:mb-10">We'll help you find the right path.</p>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/30 md:w-[18px] md:h-[18px]" />
                  <input 
                    type="text" 
                    required
                    placeholder="Enter your name"
                    className="w-full bg-[#111] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-4 md:pr-6 text-sm md:text-base text-white focus:outline-none focus:border-orange-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-white/30 md:w-[18px] md:h-[18px]" />
                  <input 
                    type="tel" 
                    required
                    placeholder="e.g. +91 90000 00000"
                    className="w-full bg-[#111] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 md:pl-14 pr-4 md:pr-6 text-sm md:text-base text-white focus:outline-none focus:border-orange-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-2">Interested Course</label>
                <select 
                  className="w-full bg-[#111] border border-white/10 rounded-xl md:rounded-2xl py-3 md:py-4 px-4 md:px-6 text-sm md:text-base text-white focus:outline-none focus:border-orange-500 transition-all font-medium appearance-none"
                >
                  <option>JEE Physics Pro</option>
                  <option>JEE Chemistry Master</option>
                  <option>NEET Biology Intensive</option>
                  <option>Foundation Course</option>
                </select>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 md:py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl md:rounded-2xl text-base md:text-xl transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 mt-4 md:mt-8 disabled:opacity-50 uppercase tracking-widest"
              >
                {loading ? 'Processing...' : 'Send Request'} <Send size={18} className="md:w-5 md:h-5" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default RequestCallback;
