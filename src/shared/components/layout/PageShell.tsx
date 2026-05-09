import React from 'react';
import type { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export const PageShell: React.FC<PageShellProps> = ({ 
  title, 
  subtitle, 
  children, 
  actions,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--border-light)] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-black text-[var(--text-main)] mb-1">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm font-medium text-[var(--text-muted)]">
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full relative">
        {children}
      </div>
    </div>
  );
};
