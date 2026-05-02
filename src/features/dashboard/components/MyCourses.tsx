import { useState, useEffect } from 'react';
import { BookOpen, Video, Clock, FileText } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface EnrolledCourse {
  id: string;
  status: string;
  course: {
    id: string;
    title: string;
    description: string;
    image_url: string;
    price: number;
    category: string;
  };
  payments: {
    amount_paid: number;
  }[];
}

export const MyCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchEnrolledCourses();
  }, [user]);

  const fetchEnrolledCourses = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        id,
        status,
        course:courses(*),
        payments:fee_payments(amount_paid)
      `)
      .eq('student_id', user?.id);
    
    if (error) {
      console.error(error);
    } else {
      setEnrolledCourses(data as any || []);
    }
    setIsLoading(false);
  };

  const calculateFinance = (course: EnrolledCourse) => {
    const paid = course.payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const total = course.course.price;
    const due = total - paid;
    return { paid, total, due };
  };

  if (isLoading) return <div className="py-20 text-center text-gray-400">Loading your courses...</div>;

  const activeCourses = enrolledCourses.filter(c => c.status === 'active');
  const pendingRequests = enrolledCourses.filter(c => c.status === 'pending');

  return (
    <div className="space-y-12">
      {/* Active Courses */}
      <section>
        <h2 className="text-2xl font-display font-black text-gray-800 mb-6 flex items-center gap-2">
          <BookOpen className="text-primary" /> Active Learning
        </h2>
        {activeCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeCourses.map(enr => {
              const { paid, total, due } = calculateFinance(enr);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  key={enr.id} 
                  className="bg-white rounded-[2rem] border border-light overflow-hidden hover:shadow-2xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img src={enr.course.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-primary">
                        {enr.course.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{enr.course.title}</h3>
                    
                    {/* Fee Status Bar */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                        <span className="text-gray-400">Fee Status</span>
                        <span className={due > 0 ? 'text-orange-600' : 'text-green-600'}>
                          {due > 0 ? `₹${due} Remaining` : 'Fully Paid'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-1000 ${due > 0 ? 'bg-orange-500' : 'bg-green-500'}`}
                            style={{ width: `${(paid / total) * 100}%` }}
                          ></div>
                        </div>
                        <button 
                          onClick={() => navigate(`/receipt/${enr.id}`)}
                          className="p-1.5 hover:bg-gray-200 text-gray-500 rounded-lg transition-colors"
                          title="View Receipt"
                        >
                          <FileText size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Link to={`/course/${enr.course.id}`} className="py-3 bg-gray-900 text-white text-center rounded-xl text-xs font-bold hover:bg-black transition-all">
                        Curriculum
                      </Link>
                      <Link to="/live-class" className="py-3 bg-primary text-white text-center rounded-xl text-xs font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
                        <Video size={14} /> Join Class
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-[2rem] border-2 border-dashed border-light">
            <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">You haven't enrolled in any courses yet.</p>
            <Link to="/" className="inline-block mt-4 text-primary font-black text-xs uppercase tracking-widest hover:underline">Explore Courses</Link>
          </div>
        )}
      </section>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <section>
          <h2 className="text-xl font-display font-black text-gray-400 mb-6 flex items-center gap-2">
            <Clock /> Pending Approval
          </h2>
          <div className="flex flex-wrap gap-4">
            {pendingRequests.map(enr => (
              <div key={enr.id} className="bg-gray-50 border border-light px-6 py-4 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-orange-500">
                  <Clock size={20} />
                </div>
                <div>
                  <div className="font-bold text-gray-700">{enr.course.title}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Waiting for Admin to Verify</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
