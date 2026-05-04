import { motion } from 'framer-motion';
import { Target, Award, ShieldCheck, ArrowRight, Image as ImageIcon, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import TestimonialCarousel3D from '../../testimonials/components/TestimonialCarousel3D';
import TeamShowcase from '../components/TeamShowcase';

const About = () => {
  const stats = [
    { label: 'Successful Students', value: '15,000+' },
    { label: 'Expert Faculty', value: '50+' },
    { label: 'Selection Rate', value: '94%' },
    { label: 'Awards Won', value: '12' },
  ];

  return (
    <div className="pt-32 md:pt-40 bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-black mb-4 md:mb-6 tracking-tight leading-[1.1]">
              Redefining the <br />
              <span className="text-orange-500 italic">Standards of Excellence.</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed font-medium px-4 md:px-0">
              Illuster Coaching Classes is more than just an institute; it's a launchpad for India's brightest minds. We combine traditional pedagogy with cutting-edge technology.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              <Link to="/gallery" className="group flex items-center gap-2 md:gap-3 px-6 py-3.5 md:px-8 md:py-4 bg-white text-black font-black rounded-xl md:rounded-2xl hover:bg-orange-500 hover:text-white transition-all shadow-xl shadow-white/5 text-sm md:text-base">
                <ImageIcon size={18} className="md:w-5 md:h-5" />
                Explore Gallery
              </Link>
              <Link to="/request-callback" className="flex items-center gap-2 px-6 py-3.5 md:px-8 md:py-4 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-xl md:rounded-2xl font-bold hover:bg-[var(--primary-light)] transition-all text-sm md:text-base text-[var(--text-main)]">
                Talk to Us <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Team Showcase - Inspired by modern management team pages */}
      <TeamShowcase />

      {/* Stats Section */}
      <section className="py-20 border-y border-[var(--border-light)] bg-[var(--bg-card)]">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-4xl lg:text-5xl font-display font-black text-white mb-1 md:mb-2">{stat.value}</div>
                <div className="text-[10px] md:text-sm font-bold text-orange-500 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-4xl font-display font-black mb-6 md:mb-8 tracking-tight">Our Mission & <span className="text-orange-500">Core Vision</span></h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 border border-orange-500/20">
                    <Target size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Personalized Growth</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed font-medium">We believe every student has a unique learning curve. Our methodology adapts to the student, not the other way around.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Unmatched Integrity</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed font-medium">We maintain the highest standards of academic honesty and transparency.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 border border-purple-500/20">
                    <Award size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Elite Results</h3>
                    <p className="text-[var(--text-muted)] leading-relaxed font-medium">Our goal isn't just to pass; it's to dominate. Our students consistently rank in the top percentile nationally.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden bg-[#111] border border-white/10 group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 via-transparent to-transparent opacity-50"></div>
              <div className="absolute inset-0 flex items-center justify-center p-12">
                 <div className="text-center">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-6xl shadow-2xl border border-white/10 group-hover:rotate-12 transition-transform duration-500">
                      🏛️
                    </div>
                    <h3 className="text-2xl font-black mb-4 tracking-tight">Est. 2012</h3>
                    <p className="text-[var(--text-muted)] font-medium">A legacy of over 12 years in academic excellence.</p>
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-14 md:py-24 px-6 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Star size={12} fill="#F97316" /> Student Voices
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-display font-black tracking-tight">Stories of Success</h2>
          </motion.div>
          
          <TestimonialCarousel3D />
        </div>
      </section>



    </div>
  );
};

export default About;
