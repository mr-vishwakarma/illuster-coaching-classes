import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}

const StatCard = ({ icon, label, value, sub, color }: StatCardProps) => (
  <div className={`card p-5 flex items-start gap-4 border-l-4`} style={{ borderLeftColor: color }}>
    <div className="p-2.5 rounded-xl" style={{ background: `${color}18` }}>
      <div style={{ color }}>{icon}</div>
    </div>
    <div>
      <div className="text-2xl font-display font-black text-[var(--text-main)]">{value}</div>
      <div className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mt-0.5">{label}</div>
      {sub && <div className="text-[11px] text-[var(--text-muted)] mt-1 opacity-60">{sub}</div>}
    </div>
  </div>
);

interface TutorStatsProps {
  activeSessionsCount: number;
  totalSessions: number;
  pendingDoubts: number;
}

import { Radio, BookOpen, HelpCircle, TrendingUp } from 'lucide-react';

export const TutorStats = ({ activeSessionsCount, totalSessions, pendingDoubts }: TutorStatsProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 tour-stats">
      <StatCard 
        icon={<Radio size={20} />} 
        label="Active Sessions" 
        value={activeSessionsCount} 
        sub="Currently live" 
        color="#ef4444" 
      />
      <StatCard 
        icon={<BookOpen size={20} />} 
        label="Total Sessions" 
        value={totalSessions} 
        sub="All time" 
        color="#8a76ff" 
      />
      <StatCard 
        icon={<HelpCircle size={20} />} 
        label="Pending Doubts" 
        value={pendingDoubts} 
        sub="Need your answer" 
        color="#f59e0b" 
      />
      <StatCard 
        icon={<TrendingUp size={20} />} 
        label="Students" 
        value="—" 
        sub="Across all batches" 
        color="#10b981" 
      />
    </div>
  );
};
