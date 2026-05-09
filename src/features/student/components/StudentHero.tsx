import { BookOpen, TrendingUp, Zap } from 'lucide-react';

const MiniStat = ({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) => (
  <div className="card p-4 flex items-center gap-3">
    <div className="p-2 rounded-lg shrink-0" style={{ background: `${color}18` }}>
      <div style={{ color }}>{icon}</div>
    </div>
    <div>
      <div className="text-lg font-display font-black text-[var(--text-main)]">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{label}</div>
    </div>
  </div>
);

interface StudentHeroProps {
  user: any;
  greeting: string;
  enrolledCourseCount: number;
  upcomingClassCount: number;
}

export const StudentHero = ({ user, greeting, enrolledCourseCount, upcomingClassCount }: StudentHeroProps) => {
  return (
    <div className="bg-[var(--bg-card)] border-b border-[var(--border-light)]">
      <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Avatar + Greeting */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-display text-2xl font-bold shadow-lg shadow-orange-500/20 shrink-0">
              {user?.avatar}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-0.5">{greeting} ☀️</p>
              <h1 className="text-xl md:text-3xl font-display font-black text-[var(--text-main)] leading-tight">
                {user?.name.split(' ')[0]}!
              </h1>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {upcomingClassCount > 0
                  ? `${upcomingClassCount} class${upcomingClassCount > 1 ? 'es' : ''} coming up this week`
                  : 'Keep learning — consistency is key.'}
              </p>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <MiniStat icon={<BookOpen size={16} />} value={enrolledCourseCount} label="Courses" color="#f97316" />
            <MiniStat icon={<TrendingUp size={16} />} value="45%" label="Progress" color="#8a76ff" />
            <MiniStat icon={<Zap size={16} />} value={upcomingClassCount} label="Upcoming" color="#10b981" />
          </div>
        </div>
      </div>
    </div>
  );
};
