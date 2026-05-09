import React from 'react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  message?: string;
  action?: ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  message, 
  action,
  className = ''
}) => {
  return (
    <div className={`card p-14 text-center flex flex-col items-center justify-center ${className}`}>
      <div className="text-[var(--text-muted)] opacity-20 mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="font-display font-black text-lg mb-2 text-[var(--text-main)]">
        {title}
      </h3>
      {message && (
        <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto leading-relaxed italic mb-6">
          {message}
        </p>
      )}
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  );
};
