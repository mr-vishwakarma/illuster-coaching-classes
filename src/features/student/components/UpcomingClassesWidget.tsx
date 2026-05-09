import { Calendar, Clock, Video } from 'lucide-react';
import { courses } from '../../website/courses';

export const UpcomingClassesWidget = ({ classes }: { classes: any[] }) => {
  if (classes.length === 0) {
    return (
      <div className="card p-8 text-center bg-gray-50/50 border-dashed">
        <Calendar className="mx-auto text-gray-300 mb-3" size={32} />
        <h3 className="font-bold text-gray-800 mb-1">No Upcoming Classes</h3>
        <p className="text-xs text-gray-500">You're all caught up for now.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {classes.slice(0, 3).map(cls => {
        const courseObj = courses.find((c: any) => c.id === cls.courseId);
        return (
          <div key={cls.id} className="p-3 bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl hover:border-orange-500/30 transition-all">
            <div className="flex justify-between items-center mb-1.5">
              <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 text-[9px] font-black uppercase tracking-widest">{courseObj?.subject}</span>
              <span className="text-[10px] font-bold text-[var(--text-muted)]">{cls.date}</span>
            </div>
            <h4 className="font-bold text-xs text-[var(--text-main)] mb-2 leading-tight">{cls.title}</h4>
            <div className="flex items-center gap-4 text-[10px] font-bold text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5"><Clock size={12} className="text-orange-500" /> {cls.time}</div>
              <div className="flex items-center gap-1.5"><Video size={12} className="text-orange-500" /> Live</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
