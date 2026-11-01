import React from 'react';

type StarBorderProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  color?: string;
  speed?: string;
  children?: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

export function StarBorder<T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'rgba(16, 185, 129, 0.7)',
  speed = '4s',
  children,
  ...rest
}: StarBorderProps<T>) {
  const Component = as || 'button';

  return (
    <Component
      className={`star-border-container ${className}`}
      {...rest}
    >
      <div
        className="star-border-glow top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 65%)`,
          animationDuration: speed,
        }}
      />
      <div
        className="star-border-glow bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 65%)`,
          animationDuration: speed,
        }}
      />
      <div className="star-border-content">
        {children}
      </div>
    </Component>
  );
}

export default StarBorder;
