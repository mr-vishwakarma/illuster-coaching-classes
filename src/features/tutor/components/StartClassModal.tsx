import React from 'react';
import { X, Mic, AlertCircle } from 'lucide-react';

interface StartClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  setTitle: (val: string) => void;
  batch: string;
  setBatch: (val: string) => void;
  isCreating: boolean;
}

export const StartClassModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  setTitle,
  batch,
  setBatch,
  isCreating
}: StartClassModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--bg-main)]/80 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-[var(--bg-card)] w-full max-w-md rounded-3xl shadow-2xl border border-[var(--border-light)] relative overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-display font-black text-[var(--text-main)] flex items-center gap-2">
              <Mic className="text-red-500" /> Start Live Class
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-[var(--bg-main)] rounded-full transition-colors">
              <X size={20} className="text-[var(--text-muted)]" />
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-of-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Class Title</label>
              <input
                autoFocus
                required
                type="text"
                placeholder="e.g. Organic Chemistry: Part 2"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm font-bold focus:border-red-500/50 outline-none transition-all"
              />
            </div>

            <div className="mt-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-2">Select Batch</label>
              <select
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-light)] rounded-xl px-4 py-3 text-sm font-bold outline-none cursor-pointer"
              >
                <option>Batch A - AI Cohort</option>
                <option>Batch B - Advanced Physics</option>
                <option>Batch C - Foundation</option>
              </select>
            </div>

            <div className="mt-6 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3">
              <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-red-500/80 leading-relaxed uppercase tracking-wider">
                Clicking Start will instantly notify all students in this batch and activate your microphone.
              </p>
            </div>

            <button
              disabled={isCreating}
              className="w-full mt-6 py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isCreating ? 'Starting...' : 'Go Live Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
