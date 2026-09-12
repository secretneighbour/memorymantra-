import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
  highlight?: boolean;
  role?: string;
  tabIndex?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = true,
  highlight = false,
  role,
  tabIndex,
}) => {
  return (
    <div
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      className={`frost-card rounded-2xl p-6 transition-all duration-300 relative overflow-hidden ${
        hoverEffect ? 'hover:-translate-y-1 hover:shadow-lg hover:border-ner-black/30' : ''
      } ${highlight ? 'border-ner-terracotta/60 shadow-md ring-1 ring-ner-terracotta/20' : ''} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
