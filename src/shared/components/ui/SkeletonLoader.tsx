import React from 'react';

interface SkeletonLoaderProps {
  rows?: number;
  className?: string;
  type?: 'text' | 'card' | 'avatar';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  rows = 1, 
  className = '',
  type = 'text' 
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-light)] animate-pulse ${className}`}>
            <div className="h-4 bg-[var(--border-light)] rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-[var(--border-light)] rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-[var(--border-light)] rounded w-full"></div>
          </div>
        );
      case 'avatar':
        return (
          <div className={`h-12 w-12 rounded-full bg-[var(--border-light)] animate-pulse ${className}`}></div>
        );
      case 'text':
      default:
        return (
          <div className={`space-y-3 ${className}`}>
            {Array.from({ length: rows }).map((_, i) => (
              <div 
                key={i} 
                className={`h-4 bg-[var(--border-light)] rounded animate-pulse ${
                  i === rows - 1 && rows > 1 ? 'w-2/3' : 'w-full'
                }`}
              ></div>
            ))}
          </div>
        );
    }
  };

  return <>{renderSkeleton()}</>;
};
