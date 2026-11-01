import React, { useEffect, useState } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number;
  separator?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  to,
  from = 0,
  duration = 1.2,
  decimals = 2,
  separator = ',',
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [current, setCurrent] = useState<number>(from);

  useEffect(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrent(to);
      return;
    }

    let startTimestamp: number | null = null;
    const stepDuration = duration * 1000;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / stepDuration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = from + (to - from) * ease;
      setCurrent(val);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      } else {
        setCurrent(to);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [to, from, duration]);

  const formatted = current.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span className={`count-up-number ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default CountUp;
