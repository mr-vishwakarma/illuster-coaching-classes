import { useState, useEffect } from 'react';
import { IndianRupee, Plus, Search, TrendingUp } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface EnrollmentFinance {
  id: string;
  student: {
    full_name: string;
  };
  course: {
    title: string;
    price: number;
  };
  payments: {
    amount_paid: number;
  }[];
}

export const FinanceManager = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentFinance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentFinance | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentRemarks, setPaymentRemarks] = useState('');

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchFinanceData = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        id,
        student:profiles(full_name),
        course:courses(title, price),
        payments:fee_payments(amount_paid)
      `)
      .eq('status', 'active');
    
    if (error) {
      toast.error("Failed to load finance data");
    } else {
      setEnrollments(data as any || []);
    }
    setIsLoading(false);
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollment || paymentAmount <= 0) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('fee_payments')
      .insert([
        { 
          enrollment_id: selectedEnrollment.id, 
          amount_paid: paymentAmount,
          remarks: paymentRemarks,
          recorded_by: (await supabase.auth.getUser()).data.user?.id
        }
      ]);

    if (error) {
      toast.error("Payment recording failed");
    } else {
      toast.success("Payment recorded successfully!");
      setIsPaymentModalOpen(false);
      fetchFinanceData();
      setPaymentAmount(0);
      setPaymentRemarks('');
    }
    setIsLoading(false);
  };

  const calculateFinance = (enrollment: EnrollmentFinance) => {
    const paid = enrollment.payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const total = enrollment.course.price;
    const due = total - paid;
    return { paid, total, due };
  };

  const filteredEnrollments = enrollments.filter(e => 
    e.student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-primary/5 border-primary/20">
          <div className="text-xs font-black uppercase tracking-widest text-primary mb-1">Total Collections</div>
          <div className="text-2xl font-black text-gray-800 flex items-center gap-1">
            <IndianRupee size={20} />
            {enrollments.reduce((sum, e) => sum + e.payments.reduce((s, p) => s + Number(p.amount_paid), 0), 0)}
          </div>
        </div>
        <div className="card p-6 bg-orange-50 border-orange-200">
          <div className="text-xs font-black uppercase tracking-widest text-orange-600 mb-1">Total Outstanding</div>
          <div className="text-2xl font-black text-gray-800 flex items-center gap-1">
            <IndianRupee size={20} />
            {enrollments.reduce((sum, e) => sum + (e.course.price - e.payments.reduce((s, p) => s + Number(p.amount_paid), 0)), 0)}
          </div>
        </div>
        <div className="card p-6 bg-green-50 border-green-200">
          <div className="text-xs font-black uppercase tracking-widest text-green-600 mb-1">Active Enrollments</div>
          <div className="text-2xl font-black text-gray-800 flex items-center gap-1">
            <TrendingUp size={20} className="text-green-600" />
            {enrollments.length}
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-light">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search student or course..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-light rounded-xl focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Finance Table */}
      <div className="bg-white rounded-2xl border border-light overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Course</th>
              <th className="px-6 py-4">Total Fee</th>
              <th className="px-6 py-4">Paid</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-light">
            {isLoading ? (
              <tr><td colSpan={6} className="py-20 text-center">Loading...</td></tr>
            ) : filteredEnrollments.length > 0 ? (
              filteredEnrollments.map(enrollment => {
                const { paid, total, due } = calculateFinance(enrollment);
                return (
                  <tr key={enrollment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{enrollment.student.full_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{enrollment.course.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">₹{total}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-green-600 font-bold">₹{paid}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`${due > 0 ? 'text-red-500' : 'text-green-600'} font-black`}>
                        {due > 0 ? `₹${due}` : 'CLEARED'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => {
                          setSelectedEnrollment(enrollment);
                          setIsPaymentModalOpen(true);
                        }}
                        className="btn btn-primary px-4 py-1.5 text-xs flex items-center gap-2 ml-auto"
                      >
                        <Plus size={14} /> Log Payment
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={6} className="py-20 text-center text-gray-400">No active enrollments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {isPaymentModalOpen && selectedEnrollment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-3xl overflow-hidden relative z-10 shadow-2xl p-8"
            >
              <h2 className="text-2xl font-display font-black text-gray-800 mb-1">Record Fee Payment</h2>
              <p className="text-sm text-gray-500 mb-6">Enter payment details for <span className="font-bold text-primary">{selectedEnrollment.student.full_name}</span></p>

              <form onSubmit={handleAddPayment} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Amount Received (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      required
                      type="number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-light rounded-xl outline-none focus:border-primary/50"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Remarks / Transaction ID</label>
                  <textarea 
                    className="w-full px-4 py-3 bg-gray-50 border border-light rounded-xl outline-none focus:border-primary/50"
                    placeholder="e.g. Received via GPay / Cash"
                    value={paymentRemarks}
                    onChange={(e) => setPaymentRemarks(e.target.value)}
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsPaymentModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
                  <button type="submit" disabled={isLoading} className="flex-2 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">
                    {isLoading ? 'Processing...' : 'Confirm Payment'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
