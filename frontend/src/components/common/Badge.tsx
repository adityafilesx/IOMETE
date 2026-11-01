import React from 'react';

export type BadgeVariant = 'sourced' | 'assumed' | 'unknown' | 'verified' | 'warning' | 'neutral' | 'success' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  className = '',
  title,
}) => {
  return (
    <span className={`proof-badge badge-${variant} ${className}`} title={title}>
      {children}
    </span>
  );
};

export default Badge;
