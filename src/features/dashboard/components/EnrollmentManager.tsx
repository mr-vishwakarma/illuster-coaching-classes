import { useState, useEffect } from 'react';
import { Check, X, Clock, User, BookOpen, AlertCircle } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface EnrollmentRequest {
  id: string;
  status: string;
  enrolled_at: string;
  student: {
    full_name: string;
    avatar_url: string;
  };
  course: {
    title: string;
    price: number;
  };
}

export const EnrollmentManager = () => {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    // Note: We need to use profiles table for student info
    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        id,
        status,
        enrolled_at,
        student:profiles!course_enrollments_student_id_fkey(full_name, avatar_url),
        course:courses(title, price)
      `)
      .eq('status', 'pending')
      .order('enrolled_at', { ascending: false });
    
    if (error) {
      console.error(error);
      toast.error("Failed to load requests");
    } else {
      setRequests(data as any || []);
    }
    setIsLoading(false);
  };

  const handleAction = async (id: string, newStatus: 'active' | 'rejected') => {
    const { error } = await supabase
      .from('course_enrollments')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) toast.error("Action failed");
    else {
      toast.success(`Enrollment ${newStatus === 'active' ? 'Approved' : 'Rejected'}`);
      fetchRequests();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-light">
        <h3 className="font-display font-black text-gray-800 flex items-center gap-2">
          <Clock className="text-orange-500" size={20} /> Pending Approvals
        </h3>
        <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-black">
          {requests.length} NEW REQUESTS
        </span>
      </div>

      <div className="grid gap-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : requests.length > 0 ? (
          requests.map(req => (
            <motion.div 
              layout
              key={req.id}
              className="bg-white p-6 rounded-2xl border border-light hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-primary font-bold text-xl overflow-hidden">
                  {req.student?.avatar_url ? (
                    <img src={req.student.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    req.student?.full_name?.charAt(0) || 'S'
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{req.student?.full_name || 'Anonymous Student'}</h4>
                  <p className="text-xs text-gray-400">Requested {new Date(req.enrolled_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex-1 px-6 border-l border-r border-light hidden md:block">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-1">
                  <BookOpen size={14} className="text-primary" /> {req.course?.title}
                </div>
                <div className="text-xs text-gray-400">Course Fee: <span className="text-gray-800 font-black">₹{req.course?.price}</span></div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleAction(req.id, 'active')}
                  className="p-3 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-xl transition-all"
                  title="Approve Enrollment"
                >
                  <Check size={20} />
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'rejected')}
                  className="p-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all"
                  title="Reject Request"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-light">
            <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">No pending enrollment requests.</p>
          </div>
        )}
      </div>
    </div>
  );
};
