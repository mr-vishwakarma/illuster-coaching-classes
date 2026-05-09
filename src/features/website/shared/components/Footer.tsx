import { Link } from 'react-router-dom';
import { MapPin, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 text-white">
      {/* Integrated CTA Section (Top part of footer) */}
      <div className="py-12 md:py-24 bg-gradient-to-b from-black to-[#050505] relative overflow-hidden flex items-center justify-center border-b border-white/5">
        {/* Decorative elements */}
        <div className="absolute bottom-10 right-[35%] w-4 h-4 bg-orange-500/20 rounded-full animate-pulse"></div>
        <div className="absolute top-10 left-[20%] w-3 h-3 bg-white/20 rounded-full"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-5xl lg:text-7xl font-display font-black text-white mb-4 md:mb-6 leading-tight tracking-tight uppercase"
          >
            Ready to <span className="text-orange-500">Accelerate?</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-lg lg:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-bold italic"
          >
            Join Illuster today. Let our expert mentors guide you through the toughest challenges.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
          >
            <Link to="/courses" className="px-8 py-3.5 md:px-10 md:py-4 rounded-xl bg-orange-500 text-white font-black text-xs md:text-base hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 w-full sm:w-auto uppercase tracking-widest">
              Enroll Today
            </Link>
            <Link to="/request-callback" className="px-8 py-3.5 md:px-10 md:py-4 rounded-xl bg-white/5 border border-white/10 text-white font-black text-xs md:text-base hover:bg-white/10 transition-all w-full sm:w-auto uppercase tracking-widest">
              Get Callback
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="pt-12 md:pt-20 pb-8 md:pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-20">
            
            {/* Brand Column */}
            <div className="flex flex-col gap-6">
              <Link to="/" className="transition-transform hover:scale-105 origin-left w-fit">
                <img src="/logo.png" alt="Illuster Logo" className="h-8 md:h-10 w-auto object-contain" />
              </Link>
              <p className="text-[var(--text-muted)] text-sm md:text-base leading-relaxed font-bold italic max-w-xs">
                Empowering students to crack the toughest exams with expert guidance and structured learning.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-black mb-6 text-xs md:text-sm uppercase tracking-[0.2em] text-orange-500">Navigation</h4>
              <ul className="flex flex-col gap-3 md:gap-4">
                <li><Link to="/courses" className="text-white/60 hover:text-white hover:translate-x-1 transition-all text-sm md:text-base font-bold">All Courses</Link></li>
                <li><Link to="/about" className="text-white/60 hover:text-white hover:translate-x-1 transition-all text-sm md:text-base font-bold">Our Story</Link></li>
                <li><Link to="/#results" className="text-white/60 hover:text-white hover:translate-x-1 transition-all text-sm md:text-base font-bold">Success</Link></li>
                <li><Link to="/login" className="text-white/60 hover:text-white hover:translate-x-1 transition-all text-sm md:text-base font-bold">Student Portal</Link></li>
              </ul>
            </div>

            {/* Top Courses */}
            <div>
              <h4 className="text-white font-black mb-6 text-xs md:text-sm uppercase tracking-[0.2em] text-orange-500">Popular</h4>
              <ul className="flex flex-col gap-3 md:gap-4">
                <li><Link to="/courses" className="text-white/60 hover:text-white hover:translate-x-1 transition-all text-sm md:text-base font-bold">JEE Physics</Link></li>
                <li><Link to="/courses" className="text-white/60 hover:text-white hover:translate-x-1 transition-all text-sm md:text-base font-bold">JEE Mathematics</Link></li>
                <li><Link to="/courses" className="text-white/60 hover:text-white hover:translate-x-1 transition-all text-sm md:text-base font-bold">NEET Biology</Link></li>
                <li><Link to="/courses" className="text-white/60 hover:text-white hover:translate-x-1 transition-all text-sm md:text-base font-bold">Foundation</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-black mb-6 text-xs md:text-sm uppercase tracking-[0.2em] text-orange-500">Contact</h4>
              <ul className="flex flex-col gap-4 md:gap-6">
                <li className="flex items-start gap-4">
                  <MapPin size={18} className="text-white/30 shrink-0 mt-1" />
                  <span className="text-white/60 text-sm md:text-base font-bold italic leading-relaxed">
                    123 Education Hub, Sector 4, Kothrud, Pune, MH 411038
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <Phone size={18} className="text-white/30 shrink-0" />
                  <span className="text-white/60 text-sm md:text-base font-bold italic">+91 98765 43210</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/20 text-[10px] md:text-xs font-black uppercase tracking-widest text-center md:text-left">
              © {new Date().getFullYear()} Illuster Coaching Classes. Built for Excellence.
            </p>
            <div className="flex gap-8">
              <Link to="#" className="text-white/20 hover:text-white text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors">Privacy</Link>
              <Link to="#" className="text-white/20 hover:text-white text-[10px] md:text-xs font-black uppercase tracking-widest transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
