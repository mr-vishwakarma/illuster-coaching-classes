import { supabase } from '../../../../src/shared/lib/supabase';

export interface EnrollmentFinance {
  id: string;
  student: {
    id?: string;
    full_name: string;
    email: string;
    phone: string;
    address: string;
  };
  course: {
    title: string;
    price: number;
  };
  payments: {
    amount_paid: number;
    created_at?: string;
    payment_date?: string;
  }[];
}

export const financeApi = {
  getEnrollments: async () => {
    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        id,
        student:profiles(id, full_name, email, phone, address),
        course:courses(title, price),
        payments:fee_payments(*)
      `)
      .eq('status', 'active');
      
    if (error) throw error;
    return data as any as EnrollmentFinance[];
  },

  recordPayment: async (enrollmentId: string, amount: number, remarks: string) => {
    const userResult = await supabase.auth.getUser();
    const userId = userResult.data.user?.id;
    
    const { data, error } = await supabase
      .from('fee_payments')
      .insert([
        { 
          enrollment_id: enrollmentId, 
          amount_paid: amount,
          remarks: remarks,
          recorded_by: userId
        }
      ]);
      
    if (error) throw error;
    return data;
  }
};
