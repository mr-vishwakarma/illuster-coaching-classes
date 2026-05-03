import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Phone, Mail, MapPin, Send } from 'lucide-react';
import { courses as mockCourses } from '../../courses';
import { supabase } from '../../../shared/lib/supabase';
import { stats } from '../';
import Skeleton from '../../../shared/components/Skeleton';
import SienaParallax from '../components/SienaParallax';
import Typewriter from '../components/Typewriter';
import PerspectiveCarousel from '../../courses/components/PerspectiveCarousel';
import StickyCardStack from '../../courses/components/StickyCardStack';
import TestimonialMarquee from '../../testimonials/components/TestimonialMarquee';
import AnimatedLogoBackground from '../../about/components/AnimatedLogoBackground';
import { useTraffic } from '../../../shared/context/TrafficContext';

const Home = () => {
  const { activeUsers } = useTraffic();
  const [isLoading, setIsLoading] = React.useState(true);
  const [liveCourses, setLiveCourses] = React.useState<any[]>([]);

  useEffect(() => {
    fetchLiveCourses();
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const fetchLiveCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .limit(6);
    
    if (data && data.length > 0) {
      setLiveCourses(data);
    }
  };

  const displayCourses = liveCourses.length > 0 ? liveCourses : mockCourses;
  const topCourses = displayCourses.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[90vh] flex flex-col items-center justify-center pt-32 md:pt-36 overflow-hidden bg-black text-center" data-cursor="-orange">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-radial-gradient from-accent-orange/5 to-transparent z-0 opacity-50 blur-3xl"></div>
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-radial-gradient from-accent-red/5 to-transparent z-0 opacity-50 blur-3xl"></div>
        
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPPHBhdGggZD0iTTAgMGw0MCA0ME00MCAwbC00MCA0MCIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')] opacity-20 z-0"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="max-w-5xl flex flex-col items-center">
            
            <motion.div variants={itemVariants} className="text-accent-orange font-medium text-sm md:text-base tracking-[0.2em] uppercase mb-6">
              LEARN. BUILD. GET PLACED.
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="font-display font-medium leading-[1.1] mb-6 md:mb-8 text-white max-w-5xl mx-auto min-h-[80px] md:min-h-[100px]">
              <Typewriter />
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-base md:text-lg lg:text-xl text-gray-400 mb-8 md:mb-10 max-w-2xl leading-relaxed px-4 md:px-0">
              Join a growing community of students preparing for real-world tech careers at Illuster.
            </motion.p>
            
            {/* Avatar Group */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 mb-12">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-600 flex items-center justify-center text-xs overflow-hidden"><img src="https://i.pravatar.cc/150?u=1" alt="Student" /></div>
                <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-600 flex items-center justify-center text-xs overflow-hidden"><img src="https://i.pravatar.cc/150?u=2" alt="Student" /></div>
                <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-600 flex items-center justify-center text-xs overflow-hidden"><img src="https://i.pravatar.cc/150?u=3" alt="Student" /></div>
                <div className="w-10 h-10 rounded-full border-2 border-black bg-gray-600 flex items-center justify-center text-xs overflow-hidden"><img src="https://i.pravatar.cc/150?u=4" alt="Student" /></div>
              </div>
              <p className="text-sm text-gray-400 font-medium flex items-center gap-2 flex-wrap">
                <span className="text-accent-orange font-bold">1 Million+</span> Students Enrolled
                <span className="hidden sm:block w-1 h-1 rounded-full bg-gray-600"></span>
                <span className="flex items-center gap-1.5 text-green-400 font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {activeUsers} Live Now
                </span>
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link to="/courses" className="magnet-effect px-6 py-3.5 md:px-8 md:py-4 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base md:text-lg transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2">
                Start Journey <ArrowRight size={18} className="md:w-5 md:h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-20 bg-[var(--bg-card)] border-y border-[var(--border-light)]">
        <div className="container mx-auto px-6">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {stats.map((stat, idx) => (
              <motion.div key={idx} variants={itemVariants} className="text-center group">
                <div className="text-3xl md:text-4xl lg:text-5xl font-display font-black text-primary mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">{stat.value}</div>
                <div className="text-[10px] md:text-sm font-bold text-[var(--text-muted)] uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Animated Branding */}
      <AnimatedLogoBackground />

      {/* Siena Parallax Documentary Section */}
      <SienaParallax 
        imageSrc="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"
        title="Master The Code"
        subtitle="Immerse yourself in our comprehensive curriculum designed to take you from a beginner to an industry-ready professional."
      />

      {/* Why Choose Us */}
      <section className="py-14 md:py-24 bg-[var(--bg-main)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6"
            >
              Why Choose Illuster?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-base md:text-lg lg:text-xl text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed"
            >
              We don't just teach; we engineer success through a scientifically proven learning methodology.
            </motion.p>
          </div>
          
          <div className="mt-16">
            <PerspectiveCarousel />
          </div>
        </div>
      </section>

      {/* Top Courses */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50" id="courses">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl lg:text-5xl mb-3 md:mb-4"
              >
                Trending Courses
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="text-base md:text-lg lg:text-xl text-[var(--text-muted)]"
              >
                Enroll in our highest-rated programs and start your path to success.
              </motion.p>
            </div>
            <Link to="/courses" className="btn-outline px-8 py-3 rounded-full font-bold text-sm">
              View All Courses
            </Link>
          </div>

          <div className="flex justify-center w-full mt-12 mb-20">
            {isLoading ? (
              <div className="w-full max-w-sm h-[500px] card flex flex-col p-8 space-y-4">
                <div className="flex justify-between items-start mb-4">
                  <Skeleton width="60px" height="24px" />
                  <Skeleton width="80px" height="24px" />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton width="56px" height="56px" borderRadius="1rem" />
                  <div className="space-y-2 flex-1">
                    <Skeleton width="70%" height="20px" />
                    <Skeleton width="40%" height="16px" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton width="100%" height="16px" />
                  <Skeleton width="90%" height="16px" />
                  <Skeleton width="95%" height="16px" />
                </div>
                <div className="pt-6 border-t border-[var(--border-light)] mt-auto flex justify-between items-center">
                  <Skeleton width="100px" height="32px" />
                  <Skeleton width="40px" height="40px" borderRadius="50%" />
                </div>
              </div>
            ) : (
              <StickyCardStack courses={topCourses as any} />
            )}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-14 md:py-24 bg-[var(--bg-main)] relative z-20" id="contact">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl mb-6 md:mb-8 leading-tight">Get in Touch <br/>with Our Team</h2>
              <p className="text-base md:text-lg lg:text-xl text-[var(--text-muted)] mb-10 md:mb-12 leading-relaxed">
                Have questions about our courses or need help with enrollment? Our team of educational counselors is here to guide you.
              </p>

              <div className="grid gap-10">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Call Our Admissions</h4>
                    <p className="text-[var(--text-muted)]">+91 98765 43210</p>
                    <p className="text-[var(--text-muted)]">+91 98765 43211</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Send an Email</h4>
                    <p className="text-[var(--text-muted)]">admissions@illuster.com</p>
                    <p className="text-[var(--text-muted)]">support@illuster.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-full bg-accent-purple/10 text-accent-purple flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2">Main Campus</h4>
                    <p className="text-[var(--text-muted)]">123 Education Hub, Sector 4, Kothrud, Pune, MH 411038</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card p-5 md:p-10 lg:p-12 shadow-2xl border border-white/5"
            >
              <h3 className="text-xl md:text-3xl font-display font-black mb-6 md:mb-10 text-white">Request a Callback</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4 md:space-y-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                    <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all font-bold" placeholder="John Doe" />
                  </div>
                  <div className="space-y-1.5 md:space-y-2">
                    <label className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-widest ml-1">Phone Number</label>
                    <input type="tel" className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all font-bold" placeholder="+91 98765 43210" />
                  </div>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all font-bold" placeholder="john@example.com" />
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-widest ml-1">Select Course</label>
                  <select className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all font-bold appearance-none">
                    <option className="bg-black">Select a course</option>
                    {displayCourses.map(c => <option key={c.id} className="bg-black">{c.title}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5 md:space-y-2">
                  <label className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-widest ml-1">Your Message</label>
                  <textarea className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-orange-500 transition-all font-bold h-24" placeholder="Tell us about your learning goals..."></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm md:text-lg font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-orange-500/20">
                  Submit Inquiry <Send size={18} className="md:w-5 md:h-5" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Student Reviews Marquee */}
      <TestimonialMarquee />

    </motion.div>
  );
};

export default Home;

