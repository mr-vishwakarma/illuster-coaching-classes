import { useState } from 'react';
import { IndianRupee, Plus, Search, TrendingUp, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

import type { EnrollmentFinance } from '../api/finance';
import { useFinance } from '../hooks/useFinance';

export const FinanceManager = () => {
  const navigate = useNavigate();
  const { enrollments, isLoading, chartData, recordPayment, calculateFinance } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState<EnrollmentFinance | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentRemarks, setPaymentRemarks] = useState('');
  
  // Student Profile Sync State
  const [studentDetails, setStudentDetails] = useState({
    id: '',
    full_name: '',
    email: '',
    phone: '',
    address: ''
  });

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnrollment) return;

    const success = await recordPayment(selectedEnrollment.id, paymentAmount, paymentRemarks);
    
    if (success) {
      setIsPaymentModalOpen(false);
      setPaymentAmount(0);
      setPaymentRemarks('');
      
      // Offer to open receipt
      if (window.confirm("Payment recorded! Would you like to view and print the receipt?")) {
        navigate(`/receipt/${selectedEnrollment.id}`);
      }
    }
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

      {/* Revenue Analytics Chart */}
      <div className="card p-6 bg-[var(--bg-card)]">
        <h3 className="text-base font-display font-black text-[var(--text-main)] mb-6">Revenue Analytics</h3>
        <div className="h-64 w-full" style={{ minHeight: 250 }}>
          <ResponsiveContainer width="100%" height="100%" minHeight={250}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickFormatter={(value) => `₹${value}`} dx={-10} />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border-light)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                formatter={(value: any) => [`₹${value}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
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
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left whitespace-nowrap">
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
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => navigate(`/receipt/${enrollment.id}`)}
                          className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors"
                          title="View Receipt"
                        >
                          <FileText size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedEnrollment(enrollment);
                            setStudentDetails({
                              id: (enrollment.student as any).id,
                              full_name: enrollment.student.full_name,
                              email: enrollment.student.email || '',
                              phone: enrollment.student.phone || '',
                              address: (enrollment.student as any).address || ''
                            });
                            setIsPaymentModalOpen(true);
                          }}
                          className="btn btn-primary px-4 py-1.5 text-xs flex items-center gap-2"
                        >
                          <Plus size={14} /> Log Payment
                        </button>
                      </div>
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

              <form onSubmit={handleAddPayment} className="space-y-6">
                {/* Student Info Summary */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-light">
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Student Details</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Name</span>
                      <span className="font-bold text-gray-800">{studentDetails.full_name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Mobile</span>
                      <span className="font-bold text-gray-800">{studentDetails.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Email</span>
                      <span className="font-bold text-gray-800">{studentDetails.email || 'Not provided'}</span>
                    </div>
                    {studentDetails.address && (
                      <div className="pt-2 mt-2 border-t border-light text-[10px] text-gray-400 italic">
                        {studentDetails.address}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-primary font-black">Amount Received (₹)</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                      <input 
                        autoFocus
                        required
                        type="number"
                        className="w-full pl-12 pr-4 py-3 bg-primary/5 border border-primary/20 rounded-xl outline-none focus:border-primary font-black text-xl"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(Number(e.target.value))}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Payment Remarks</label>
                    <textarea 
                      className="w-full px-4 py-3 bg-gray-50 border border-light rounded-xl outline-none focus:border-primary/50 text-sm"
                      placeholder="e.g. Received via GPay / Cash"
                      value={paymentRemarks}
                      onChange={(e) => setPaymentRemarks(e.target.value)}
                    />
                  </div>
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
