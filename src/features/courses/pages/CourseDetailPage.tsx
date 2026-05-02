import { useParams } from 'react-router-dom';
import { Play, CheckCircle2, User, Cloud, Sparkles } from 'lucide-react';
import { courses as mockCourses } from '../';
import { motion } from 'framer-motion';
import { useAuth } from '../../../shared/context/AuthContext';
import { supabase } from '../../../shared/lib/supabase';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<any>(null);
  const [enrollStatus, setEnrollStatus] = useState<'none' | 'pending' | 'active'>('none');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCourseData();
  }, [id, user]);

  const loadCourseData = async () => {
    setIsLoading(true);
    
    // 1. Try to find in mock data first for instant UI
    const mockMatch = mockCourses.find(c => c.id === id);
    if (mockMatch) setCourse(mockMatch);

    // 2. Try to fetch from Supabase if id looks like a UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (id && uuidRegex.test(id)) {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) setCourse(data);
    }

    // 3. Check enrollment status if logged in
    if (user && id && uuidRegex.test(id)) {
      const { data } = await supabase
        .from('course_enrollments')
        .select('status')
        .eq('student_id', user?.id)
        .eq('course_id', id)
        .maybeSingle();

      if (data) setEnrollStatus(data.status as any);
    }

    setIsLoading(false);
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.info("Please login to enroll");
      navigate('/login');
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!id || !uuidRegex.test(id)) {
      toast.warning("Enrollment is only available for live courses.");
      return;
    }

    if (enrollStatus !== 'none') return;

    setIsLoading(true);
    const { error } = await supabase
      .from('course_enrollments')
      .insert([
        { student_id: user.id, course_id: id, status: 'pending' }
      ]);

    if (error) {
      toast.error("Failed to submit request. Please ensure the course is active.");
    } else {
      toast.success("Enrollment request sent to Admin!");
      setEnrollStatus('pending');
    }
    setIsLoading(false);
  };

  if (isLoading && !course) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="animate-spin h-10 w-10 border-b-2 border-primary rounded-full"></div></div>;
  if (!course) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Course not found.</div>;
  
  return (
    <div className="pt-32 md:pt-40 min-h-screen bg-[#050805] text-white selection:bg-green-500/30">
      
      {/* Background ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-green-900/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 max-w-7xl mx-auto">
          
          {/* Left Column - Video & Title */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Video Thumbnail Box */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-green-900/40 to-[#0a120a] group cursor-pointer shadow-2xl"
            >
              {/* Fake UI Overlay representing the screenshot's complex thumbnail */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center">
                    <span className="text-xs">🚀</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white drop-shadow-md">Cohort 3.0 | Job + Startup Ready AI</h4>
                    <p className="text-[10px] text-white/70">Build Real Products (Full Stack, Gen AI, DevOps)</p>
                  </div>
                </div>

                <div className="self-end bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-medium">
                  Watch on <span className="font-bold">YouTube</span>
                </div>
              </div>

              {/* Big "3.0" Watermark Text */}
              <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[180px] font-black text-white/[0.03] select-none pointer-events-none tracking-tighter leading-none">
                3.0
              </div>

              {/* Youtube Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="w-16 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] group-hover:scale-110 transition-transform duration-300">
                  <Play className="text-white fill-white" size={24} />
                </div>
              </div>
            </motion.div>

            {/* Title Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-4 relative"
            >
              <h1 className="text-2xl md:text-4xl lg:text-6xl font-display font-bold leading-tight tracking-tight">
                {course.title || "3.0 Job-Ready AI Powered Cohort"}
              </h1>
              
              {/* Decorative handwritten badge */}
              <div className="absolute -bottom-6 right-10 md:right-32 rotate-[-5deg]">
                <div className="bg-green-600 text-white text-[8px] md:text-xs font-black italic px-3 py-1 md:px-4 md:py-1 rounded-full shadow-[0_0_15px_rgba(22,163,74,0.4)] border border-green-400">
                  JOB READY!
                </div>
                {/* Curved arrow graphic representation */}
                <svg className="absolute -left-6 top-4 w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 9l-6 6 6 6" />
                  <path d="M20 4v7a4 4 0 01-4 4H4" />
                </svg>
              </div>
            </motion.div>

          </div>

          {/* Right Column - Details Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full lg:w-[450px] shrink-0"
          >
            <div className="bg-[#0a0e0a] border border-green-900/30 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
              
              {/* Subtle top inner glow */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent"></div>

              {/* Info Pills */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-6 md:mb-8">
                <div className="bg-[#111811] border border-white/5 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs text-white/80 flex items-center gap-1.5 md:gap-2">
                  <Sparkles size={10} className="text-green-400 md:w-3 md:h-3" />
                  <span className="text-green-500 font-bold">Schedule:</span> Mon-Sat
                </div>
                <div className="bg-[#111811] border border-white/5 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs text-white/80 flex items-center gap-1.5 md:gap-2">
                  <Sparkles size={10} className="text-green-400 md:w-3 md:h-3" />
                  <span className="text-green-500 font-bold">Cert:</span> Included
                </div>
                <div className="bg-[#111811] border border-white/5 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs text-white/80 flex items-center gap-1.5 md:gap-2">
                  <Sparkles size={10} className="text-green-400 md:w-3 md:h-3" />
                  <span className="text-green-500 font-bold">Lang:</span> Hinglish
                </div>
                <div className="bg-[#111811] border border-white/5 rounded-lg px-2 py-1.5 md:px-3 md:py-2 text-[10px] md:text-xs text-white/80 flex items-center gap-1.5 md:gap-2">
                  <Sparkles size={10} className="text-green-400 md:w-3 md:h-3" />
                  <span className="text-green-500 font-bold">Live:</span> Interactive
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8 pl-2">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-orange-200">
                    <User size={18} fill="currentColor" className="md:w-5 md:h-5" />
                  </div>
                  <div className="text-sm md:text-[15px]"><span className="font-bold">Build Real Products</span></div>
                </div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-gray-300">
                    <Cloud size={18} fill="currentColor" className="md:w-5 md:h-5" />
                  </div>
                  <div className="text-sm md:text-[15px]"><span className="font-bold">Global Certification</span></div>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-4 mb-8 opacity-60">
                <div className="h-px bg-white/20 flex-1"></div>
                <span className="text-xs font-medium tracking-wide">The Next Big Thing+</span>
                <div className="h-px bg-white/20 flex-1"></div>
              </div>

              {/* Features List */}
              <ul className="flex flex-col gap-4 mb-10 pl-2">
                {[
                  "250+ hours of live training",
                  "Learn AI + Full Stack + DevOps + System Design",
                  "Startup Mentorship + Funding Opportunity",
                  "Discord Community Access - Peer Learning",
                  "Mentorship + Career Guidance"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-[14px] text-white/90 leading-snug">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0">
                      <CheckCircle2 size={12} className="text-black" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-3 md:gap-4">
                <button 
                  onClick={handleEnroll}
                  disabled={isLoading || enrollStatus !== 'none'}
                  className={`w-full py-3.5 md:py-4 rounded-xl font-black text-base md:text-lg shadow-lg transition-all flex items-center justify-center gap-2 group uppercase tracking-widest ${
                    enrollStatus === 'active' 
                      ? 'bg-green-600 cursor-default' 
                      : enrollStatus === 'pending'
                        ? 'bg-orange-500 cursor-default'
                        : 'bg-[#34A853] hover:bg-[#2e964a]'
                  }`}
                >
                  {isLoading ? 'Processing...' : 
                   enrollStatus === 'active' ? 'Already Enrolled' : 
                   enrollStatus === 'pending' ? 'Request Pending' : 
                   'Enroll Now'}
                  {enrollStatus === 'none' && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                </button>
                <button className="w-full py-3.5 md:py-4 rounded-xl bg-[#151a15] hover:bg-[#1a211a] border border-white/5 text-white/90 font-bold text-xs md:text-[15px] transition-all flex items-center justify-center gap-2 group uppercase tracking-widest">
                  Syllabus
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
