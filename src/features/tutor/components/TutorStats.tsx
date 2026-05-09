import { Radio, BookOpen, HelpCircle, TrendingUp } from 'lucide-react';
import { StatCard } from '../../../shared/components/ui/StatCard';

interface TutorStatsProps {
  activeSessionsCount: number;
  totalSessions: number;
  pendingDoubts: number;
}

export const TutorStats = ({ activeSessionsCount, totalSessions, pendingDoubts }: TutorStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tour-stats">
      <StatCard 
        variant="simple"
        icon={<Radio size={20} />} 
        label="Active Sessions" 
        value={activeSessionsCount} 
        sub="Currently live" 
        color="#ef4444" 
      />
      <StatCard 
        variant="simple"
        icon={<BookOpen size={20} />} 
        label="Total Sessions" 
        value={totalSessions} 
        sub="All time" 
        color="#8a76ff" 
      />
      <StatCard 
        variant="simple"
        icon={<HelpCircle size={20} />} 
        label="Pending Doubts" 
        value={pendingDoubts} 
        sub="Need your answer" 
        color="#f59e0b" 
      />
      <StatCard 
        variant="simple"
        icon={<TrendingUp size={20} />} 
        label="Students" 
        value="—" 
        sub="Across all batches" 
        color="#10b981" 
      />
    </div>
  );
};
