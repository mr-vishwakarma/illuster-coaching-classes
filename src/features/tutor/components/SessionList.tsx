import { CheckCircle2, Radio, Clock } from 'lucide-react';

interface SessionRowProps {
  session: any;
  onResume: () => void;
  onEnd: () => void;
}

const SessionRow = ({ session, onResume, onEnd }: SessionRowProps) => (
  <div className="flex items-center justify-between p-4 bg-[var(--bg-main)] rounded-xl border border-[var(--border-light)] hover:border-red-500/30 transition-all">
    <div className="flex items-center gap-3">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
      <div>
        <div className="font-bold text-sm text-[var(--text-main)]">{session.title}</div>
        <div className="text-xs text-[var(--text-muted)]">{session.batch} · Started {new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onResume} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-xs font-black uppercase tracking-widest hover:bg-green-500/20 transition-all">Resume</button>
      <button onClick={onEnd} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">End</button>
    </div>
  </div>
);

interface SessionListProps {
  activeSessions: any[];
  pastSessions: any[];
  isLoading: boolean;
  onResume: (id: string) => void;
  onEnd: (id: string) => void;
}

export const SessionList = ({ activeSessions, pastSessions, isLoading, onResume, onEnd }: SessionListProps) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="card p-5 border-red-500/20">
          <h2 className="text-sm font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Currently Live
          </h2>
          <div className="flex flex-col gap-2">
            {activeSessions.map(s => (
              <SessionRow
                key={s.id}
                session={s}
                onResume={() => onResume(s.id)}
                onEnd={() => onEnd(s.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Sessions */}
      <div className="card p-5 tour-recent-sessions">
        <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-muted)] mb-4 flex items-center gap-2">
          <Clock size={14} /> Recent Sessions
        </h2>
        {isLoading ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm italic">Loading...</div>
        ) : pastSessions.length > 0 ? (
          <div className="flex flex-col gap-2">
            {pastSessions.map(s => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-main)] transition-colors">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <div>
                    <div className="font-bold text-sm text-[var(--text-main)]">{s.title}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{s.batch} · {new Date(s.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-40">Ended</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 opacity-40">
            <Radio size={32} className="mx-auto mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">No past sessions found</p>
          </div>
        )}
      </div>
    </div>
  );
};
