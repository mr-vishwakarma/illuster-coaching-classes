import { useState } from 'react';
import { Send, Image as ImageIcon, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../shared/lib/supabase';
import { useAuth } from '../../../shared/context/AuthContext';

const SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'General'];

export const QuestieForm = ({ onSubmitted }: { onSubmitted: () => void }) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    subject: 'Physics',
    question_text: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.question_text) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('questies')
        .insert({
          student_id: user.id,
          subject: formData.subject,
          question_text: formData.question_text,
          status: 'pending'
        });

      if (error) throw error;
      
      setShowSuccess(true);
      setFormData({ subject: 'Physics', question_text: '' });
      setTimeout(() => {
        setShowSuccess(false);
        onSubmitted();
      }, 2000);
    } catch (err) {
      console.error('Error submitting questie:', err);
      alert('Failed to submit your doubt. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl relative overflow-hidden">
      {showSuccess && (
        <div className="absolute inset-0 bg-green-500/90 backdrop-blur-md z-10 flex flex-col items-center justify-center text-white animate-in fade-in zoom-in duration-300">
          <CheckCircle2 size={64} className="mb-4" />
          <h3 className="text-2xl font-black uppercase tracking-tighter">Doubt Submitted!</h3>
          <p className="text-sm opacity-80 font-medium">Our tutors will respond shortly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Select Subject
          </label>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map(sub => (
              <button
                key={sub}
                type="button"
                onClick={() => setFormData({ ...formData, subject: sub })}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                  formData.subject === sub 
                    ? 'bg-[#8a76ff] text-white shadow-lg shadow-[#8a76ff]/30' 
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
            Your Question / Doubt
          </label>
          <textarea
            required
            value={formData.question_text}
            onChange={e => setFormData({ ...formData, question_text: e.target.value })}
            placeholder="Type your question here... (e.g. Can you explain the derivation of Schrödinger equation?)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-[#8a76ff] focus:border-transparent outline-none min-h-[150px] transition-all placeholder:text-gray-600"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-xs font-bold"
          >
            <ImageIcon size={18} />
            Attach Image (Coming Soon)
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !formData.question_text}
            className="bg-[#8a76ff] hover:bg-[#7b65ff] disabled:opacity-50 text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-[#8a76ff]/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Ask Now
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
