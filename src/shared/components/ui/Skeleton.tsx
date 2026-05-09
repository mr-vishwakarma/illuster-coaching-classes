import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = "", 
  width, 
  height, 
  borderRadius = "0.5rem" 
}) => {
  return (
    <div 
      className={`skeleton ${className}`}
      style={{ 
        width: width || '100%', 
        height: height || '1rem', 
        borderRadius: borderRadius 
      }}
    />
  );
};

export default Skeleton;

