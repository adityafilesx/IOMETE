import React, { useState } from 'react';
import Icons from '../Icons';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children || (
        <button
          type="button"
          className="tooltip-trigger"
          aria-label={content}
          tabIndex={0}
        >
          <Icons.Info size={13} />
        </button>
      )}
      {visible && (
        <span className="tooltip-bubble" role="tooltip">
          {content}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
