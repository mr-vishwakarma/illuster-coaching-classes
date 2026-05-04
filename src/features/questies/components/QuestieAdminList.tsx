import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, CheckCircle2, Send, User } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';
import type { Questie } from '../types';

const PAGE_SIZE = 20;

export const QuestieAdminList = () => {
  const [questies, setQuesties] = useState<Questie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchQuesties(true);
  }, []);

  const fetchQuesties = useCallback(async (reset = false) => {
    try {
      setIsLoading(true);
      const from = reset ? 0 : questies.length;
      const to = from + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from('questies')
        .select(`
          id, subject, question_text, status, answer_text, created_at, resolved_at,
          profiles:student_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setQuesties(prev => reset ? ((data as any) || []) : [...prev, ...((data as any) || [])]);
      setHasMore((data?.length || 0) === PAGE_SIZE);
    } catch (err) {
      console.error('Error fetching questies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [questies.length]);

  const handleResolve = async (qId: string) => {
    if (!answer.trim()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('questies')
        .update({
          answer_text: answer,
          status: 'resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', qId);

      if (error) throw error;
      
      setAnswer('');
      setSelectedId(null);
      fetchQuesties(true);
    } catch (err) {
      console.error('Error resolving questie:', err);
      alert('Failed to submit answer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center animate-pulse">Loading Doubts...</div>;

  const selectedQuestie = questies.find(q => q.id === selectedId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[700px]">
      {/* Sidebar List */}
      <div className="lg:w-1/3 bg-white border border-light rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 bg-gray-50 border-b border-light flex justify-between items-center">
          <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Doubt Queue</h3>
          <span className="badge bg-primary text-white">{questies.filter(q => q.status === 'pending').length} New</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {questies.map(q => (
            <div 
              key={q.id}
              onClick={() => setSelectedId(q.id)}
              className={`p-4 cursor-pointer border-b border-light transition-all ${
                selectedId === q.id ? 'bg-primary-light border-l-4 border-l-primary' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">{q.subject}</span>
                <span className={`text-[9px] font-black uppercase ${q.status === 'resolved' ? 'text-green-500' : 'text-amber-500'}`}>
                  {q.status}
                </span>
              </div>
              <p className="text-sm font-bold text-gray-800 line-clamp-1 mb-1">{q.question_text}</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold">
                <User size={10} />
                <span>{(q as any).profiles?.full_name || 'Anonymous Student'}</span>
                <span>•</span>
                <span>{new Date(q.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="p-3 border-t border-light">
              <button
                onClick={() => fetchQuesties(false)}
                disabled={isLoading}
                className="w-full py-2 bg-gray-50 hover:bg-primary/5 text-gray-500 hover:text-primary rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
              >
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Detail View */}
      <div className="lg:w-2/3 bg-white border border-light rounded-2xl overflow-hidden flex flex-col">
        {selectedQuestie ? (
          <div className="flex flex-col h-full">
            <div className="p-6 bg-gray-50 border-b border-light">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-black">Question Detail</h2>
                <div className="flex gap-2">
                  <span className="badge bg-primary-light text-primary font-bold uppercase text-[10px]">{selectedQuestie.subject}</span>
                  <span className={`badge font-bold uppercase text-[10px] ${selectedQuestie.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {selectedQuestie.status}
                  </span>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-xl border border-light shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary-dark text-white flex items-center justify-center font-bold text-xs">
                    {(selectedQuestie as any).profiles?.full_name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-800">{(selectedQuestie as any).profiles?.full_name || 'Student'}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Asked {new Date(selectedQuestie.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedQuestie.question_text}</p>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              {selectedQuestie.status === 'resolved' ? (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4 text-green-700">
                    <CheckCircle2 size={20} />
                    <h4 className="font-bold uppercase tracking-widest text-xs">Official Answer</h4>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedQuestie.answer_text}</p>
                  <div className="mt-6 pt-4 border-t border-green-200/50 flex justify-between items-center text-[10px] text-green-600 font-bold uppercase">
                    <span>Resolved at {new Date(selectedQuestie.resolved_at!).toLocaleString()}</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col h-full gap-4">
                  <div className="flex items-center gap-2 text-primary">
                    <MessageSquare size={18} />
                    <h4 className="font-bold uppercase tracking-widest text-xs">Provide Solution</h4>
                  </div>
                  <textarea 
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                    placeholder="Explain the solution step-by-step..."
                    className="w-full flex-1 p-4 border border-light rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none text-sm leading-relaxed"
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={() => handleResolve(selectedQuestie.id)}
                      disabled={isSubmitting || !answer.trim()}
                      className="btn btn-primary flex items-center gap-2 px-8"
                    >
                      {isSubmitting ? 'Submitting...' : <><Send size={16} /> Resolve Doubt</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-10 text-center">
            <MessageSquare size={64} className="mb-4 opacity-10" />
            <h3 className="text-lg font-bold">Select a doubt from the queue</h3>
            <p className="text-xs max-w-[200px] mt-1 leading-relaxed">Choose a student's question to view details and provide a solution.</p>
          </div>
        )}
      </div>
    </div>
  );
};
