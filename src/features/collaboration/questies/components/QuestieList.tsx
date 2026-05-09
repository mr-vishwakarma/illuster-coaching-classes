import { useState, useEffect } from 'react';
import { Clock, CheckCircle2, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../../../shared/lib/supabase';
import { useAuth } from '../../../../shared/context/AuthContext';
import type { Questie } from '../types';

export const QuestieList = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const { user } = useAuth();
  const [questies, setQuesties] = useState<Questie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchQuesties = async () => {
    try {
      const { data, error } = await supabase
        .from('questies')
        .select('id, subject, question_text, status, answer_text, created_at, resolved_at')
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuesties((data as Questie[]) || []);
    } catch (err) {
      console.error('Error fetching questies:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchQuesties();
  }, [user, refreshTrigger]);


  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-[var(--bg-card)] animate-pulse rounded-2xl border border-[var(--border-light)]" />
        ))}
      </div>
    );
  }

  if (questies.length === 0) {
    return (
      <div className="text-center py-20 bg-[var(--bg-card)] rounded-3xl border border-dashed border-[var(--border-light)]">
        <MessageSquare size={48} className="mx-auto text-[var(--text-muted)] mb-4 opacity-30" />
        <h3 className="text-xl font-bold text-[var(--text-main)] opacity-50">No questions yet</h3>
        <p className="text-sm text-[var(--text-muted)] mt-2">Your doubts will appear here once you submit them.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {questies.map((q) => (
        <div 
          key={q.id}
          className={`bg-[var(--bg-card)] border border-[var(--border-light)] rounded-2xl overflow-hidden transition-all duration-300 ${
            expandedId === q.id ? 'ring-2 ring-[#8a76ff]/50' : 'hover:bg-[var(--bg-main)]'
          }`}
        >
          <div 
            className="p-5 cursor-pointer flex items-start justify-between gap-4"
            onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 rounded-md bg-[#8a76ff]/20 text-[#8a76ff] text-[10px] font-black uppercase tracking-widest">
                  {q.subject}
                </span>
                <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${
                  q.status === 'resolved' ? 'text-green-400' : 'text-amber-400'
                }`}>
                  {q.status === 'resolved' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {q.status}
                </span>
              </div>
              <p className="text-[var(--text-main)] text-sm font-medium line-clamp-2 leading-relaxed">
                {q.question_text}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] mt-2 uppercase font-bold tracking-tighter">
                Asked on {new Date(q.created_at).toLocaleDateString()}
              </p>
            </div>
            <button className="text-[var(--text-muted)] mt-1">
              {expandedId === q.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>

          {expandedId === q.id && (
            <div className="px-5 pb-5 pt-2 animate-in slide-in-from-top-2 duration-300">
              <div className="h-px bg-[var(--border-light)] mb-4" />
              <div className="space-y-4">
                <div className="bg-[var(--bg-main)] p-4 rounded-xl">
                  <p className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-2 tracking-widest">Your Full Question</p>
                  <p className="text-[var(--text-main)] text-sm whitespace-pre-wrap leading-relaxed opacity-80">{q.question_text}</p>
                </div>
                
                {q.status === 'resolved' ? (
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={14} className="text-green-400" />
                      <p className="text-[10px] font-black uppercase text-green-400 tracking-widest">Tutor's Answer</p>
                    </div>
                    <p className="text-[var(--text-main)] text-sm whitespace-pre-wrap leading-relaxed opacity-90">{q.answer_text}</p>
                    {q.resolved_at && (
                      <p className="text-[9px] text-[var(--text-muted)] mt-3 font-bold uppercase tracking-tighter">
                        Resolved on {new Date(q.resolved_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-center gap-3">
                    <Clock size={16} className="text-amber-400 animate-pulse" />
                    <p className="text-xs text-amber-400 font-bold italic">
                      A tutor is currently reviewing your question...
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
