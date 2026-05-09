import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { financeApi } from '../api/finance';
import type { EnrollmentFinance } from '../api/finance';

export const useFinance = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentFinance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<{name: string, revenue: number}[]>([]);

  const fetchFinanceData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await financeApi.getEnrollments();
      setEnrollments(data);
      processChartData(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load finance data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const processChartData = (data: EnrollmentFinance[]) => {
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return d.toLocaleString('default', { month: 'short' });
    }).reverse();

    const newChartData = months.map(m => ({ name: m, revenue: 0 }));

    data.forEach(enrollment => {
      enrollment.payments?.forEach((p) => {
        if (!p.created_at && !p.payment_date) return;
        const pDate = new Date((p.created_at || p.payment_date) as string);
        const pMonth = pDate.toLocaleString('default', { month: 'short' });
        const monthEntry = newChartData.find(c => c.name === pMonth);
        if (monthEntry) {
          monthEntry.revenue += Number(p.amount_paid) || 0;
        }
      });
    });

    setChartData(newChartData);
  };

  const recordPayment = async (enrollmentId: string, amount: number, remarks: string) => {
    if (!enrollmentId || amount <= 0) return false;
    
    setIsLoading(true);
    try {
      await financeApi.recordPayment(enrollmentId, amount, remarks);
      toast.success("Payment recorded successfully!");
      await fetchFinanceData();
      return true;
    } catch (error: any) {
      toast.error(error.message || "Payment recording failed");
      setIsLoading(false);
      return false;
    }
  };

  const calculateFinance = (enrollment: EnrollmentFinance) => {
    const paid = enrollment.payments.reduce((sum, p) => sum + Number(p.amount_paid), 0);
    const total = enrollment.course.price;
    const due = total - paid;
    return { paid, total, due };
  };

  return {
    enrollments,
    isLoading,
    chartData,
    fetchFinanceData,
    recordPayment,
    calculateFinance
  };
};
