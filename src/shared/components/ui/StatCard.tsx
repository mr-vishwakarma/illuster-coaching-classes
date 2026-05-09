import { type ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  sub?: string;
  icon: ReactNode;
  color: string;
  variant?: 'simple' | 'detailed';
}

export const StatCard = ({
  label, value, change, positive, sub, icon, color, variant = 'detailed'
}: StatCardProps) => {
  if (variant === 'simple') {
    return (
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
  }

  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">{label}</span>
        <div className="p-2 rounded-lg" style={{ background: `${color}18` }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="text-2xl font-display font-black text-[var(--text-main)]">{value}</div>
      {(change || positive !== undefined) && (
        <div className={`flex items-center gap-1 text-xs font-semibold ${positive ? 'text-green-500' : 'text-red-400'}`}>
          {positive !== undefined && (positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />)}
          {change}
        </div>
      )}
      {sub && <div className="text-[11px] text-[var(--text-muted)] mt-1 opacity-60">{sub}</div>}
    </div>
  );
};
