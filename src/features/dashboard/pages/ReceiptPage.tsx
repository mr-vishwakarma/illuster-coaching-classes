import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../shared/lib/supabase';
import { Printer, ArrowLeft, CheckCircle2, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReceiptData {
  id: string;
  enrolled_at: string;
  student: {
    full_name: string;
    email: string;
    phone: string;
  };
  course: {
    title: string;
    price: number;
  };
  payments: {
    id: string;
    amount_paid: number;
    payment_date: string;
    remarks: string;
  }[];
}

const ReceiptPage = () => {
  const { enrollmentId } = useParams<{ enrollmentId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ReceiptData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReceiptData();
  }, [enrollmentId]);

  const fetchReceiptData = async () => {
    if (!enrollmentId) return;
    setIsLoading(true);
    
    const { data: enrollment, error } = await supabase
      .from('course_enrollments')
      .select(`
        id,
        enrolled_at,
        student:profiles(full_name, email, phone),
        course:courses(title, price),
        payments:fee_payments(id, amount_paid, payment_date, remarks)
      `)
      .eq('id', enrollmentId)
      .single();

    if (error || !enrollment) {
      console.error("Error fetching receipt:", error);
    } else {
      setData(enrollment as any);
    }
    setIsLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center font-display">Loading Receipt...</div>;
  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center font-display text-red-500">Receipt not found.</div>;

  const totalPaid = data.payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
  const balance = data.course.price - totalPaid;
  const latestPayment = [...data.payments].sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())[0];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navigation - Hidden on Print */}
        <div className="flex justify-between items-center print:hidden">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Printer size={18} /> Print Receipt
            </button>
          </div>
        </div>

        {/* Receipt Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-light print:shadow-none print:border-none"
        >
          {/* Header */}
          <div className="bg-gray-900 text-white p-10 flex justify-between items-start">
            <div>
              <div className="text-3xl font-display font-black tracking-tighter flex items-center gap-2 mb-2">
                <span className="text-primary italic">ILLUSTER</span>
                <span className="text-white">COACHING</span>
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Excellence in Education</p>
              <div className="mt-6 text-sm text-gray-300 space-y-1">
                <p>123 Education Hub, Sector 4, Kothrud</p>
                <p>Pune, Maharashtra 411038</p>
                <p>Contact: +91 98765 43210</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-primary font-black text-xl mb-2 flex items-center justify-end gap-2">
                <CheckCircle2 size={24} /> PAYMENT RECEIPT
              </div>
              <div className="text-sm text-gray-400">
                <p>Receipt Date: {new Date().toLocaleDateString('en-IN')}</p>
                <p>ID: REC-{data.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="p-10 space-y-10">
            {/* Student Info */}
            <div className="grid grid-cols-2 gap-10">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Billed To</h4>
                <div className="text-lg font-black text-gray-800">{data.student.full_name}</div>
                <div className="text-sm text-gray-500 mt-1">
                  <p>{data.student.email || 'Email not provided'}</p>
                  <p>{data.student.phone || 'Phone not provided'}</p>
                </div>
              </div>
              <div className="text-right">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Course Details</h4>
                <div className="text-lg font-black text-gray-800">{data.course.title}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Enrolled on {new Date(data.enrolled_at).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>

            {/* Latest Payment Summary */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex justify-between items-center">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Recent Payment</h4>
                <div className="text-2xl font-black text-gray-800 flex items-center gap-1">
                  <IndianRupee size={20} /> {latestPayment?.amount_paid.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-gray-500 mt-1">{latestPayment?.remarks || 'Fee Payment'}</p>
              </div>
              <div className="text-right">
                <div className="px-4 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                  Paid Successfully
                </div>
                <p className="text-xs text-gray-500 mt-2">{new Date(latestPayment?.payment_date).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            {/* Ledger Table */}
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Payment Ledger History</h4>
              <table className="w-full text-left text-sm">
                <thead className="border-b border-light pb-2">
                  <tr className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                    <th className="py-2">Date</th>
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light">
                  {data.payments.map((p, idx) => (
                    <tr key={idx} className="text-gray-600">
                      <td className="py-4">{new Date(p.payment_date).toLocaleDateString('en-IN')}</td>
                      <td className="py-4">{p.remarks || 'Fee Installment'}</td>
                      <td className="py-4 text-right font-bold text-gray-800">₹{p.amount_paid.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="pt-6 border-t border-light flex justify-end">
              <div className="w-64 space-y-3">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Total Course Fee</span>
                  <span className="font-bold text-gray-800">₹{data.course.price.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600 font-bold">
                  <span>Total Amount Paid</span>
                  <span>- ₹{totalPaid.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-lg font-black border-t border-light pt-3 text-gray-900">
                  <span>Balance Due</span>
                  <span className={balance > 0 ? 'text-red-500' : 'text-green-600'}>
                    ₹{balance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-20 text-center space-y-4">
              <div className="flex justify-center gap-20">
                <div className="w-40 border-t border-gray-200 pt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Student Signature</div>
                <div className="w-40 border-t border-gray-200 pt-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">Authorized Signatory</div>
              </div>
              <p className="text-[10px] text-gray-400 pt-10">This is a computer-generated receipt. No signature is required.</p>
            </div>

          </div>
        </motion.div>

        {/* Footer Help */}
        <p className="text-center text-xs text-gray-400 print:hidden">
          Need help? Contact support at <span className="text-primary">support@illuster.com</span>
        </p>

      </div>
    </div>
  );
};

export default ReceiptPage;
