import React from 'react';

export const DotMatrixBackground: React.FC = () => {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-0 w-full h-full overflow-hidden select-none" 
      aria-hidden="true"
    >
      {/* Precision Dot Matrix Grid */}
      <div className="absolute inset-0 dot-matrix-canvas opacity-70 dark:dot-matrix-dark dark:opacity-40" />

      {/* Subtle Northeast contour ambient glow */}
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] rounded-full blur-[120px] opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(222, 74, 48, 0.18) 0%, rgba(16, 185, 129, 0.08) 50%, transparent 70%)'
        }}
      />
      <div 
        className="absolute bottom-10 right-10 w-[600px] h-[600px] rounded-full blur-[140px] opacity-15 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)'
        }}
      />
    </div>
  );
};
