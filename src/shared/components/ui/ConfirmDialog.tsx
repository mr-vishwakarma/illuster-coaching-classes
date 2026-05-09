import React from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string | ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false
}) => {
  const getConfirmButtonClasses = () => {
    switch (confirmVariant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20';
      case 'warning':
        return 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20';
      case 'primary':
      default:
        return 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white shadow-[var(--primary)]/20';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[var(--bg-card)] rounded-3xl shadow-2xl overflow-hidden border border-[var(--border-light)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border-light)] bg-[var(--bg-main)]">
              <h3 className="text-xl font-display font-black text-[var(--text-main)]">{title}</h3>
              <button 
                onClick={onClose}
                disabled={isLoading}
                className="p-2 hover:bg-[var(--border-light)] rounded-xl transition-colors text-[var(--text-muted)] hover:text-[var(--text-main)] disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="text-[var(--text-muted)] text-sm leading-relaxed mb-8">
                {description}
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-[var(--text-main)] hover:bg-[var(--border-light)] transition-colors disabled:opacity-50"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center justify-center min-w-[120px] disabled:opacity-70 ${getConfirmButtonClasses()}`}
                >
                  {isLoading ? 'Processing...' : confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
