import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
  color: string;
}

export const StatCard = ({
  label, value, change, positive, icon, color
}: StatCardProps) => (
  <div className="card p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
      <div className="p-2 rounded-lg" style={{ background: `${color}18` }}>
        <div style={{ color }}>{icon}</div>
      </div>
    </div>
    <div className="text-2xl font-display font-black text-[var(--text-main)]">{value}</div>
    <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-green-500' : 'text-red-400'}`}>
      {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      {change}
    </div>
  </div>
);
