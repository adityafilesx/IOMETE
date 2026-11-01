import React, { useEffect } from 'react';
import Icons from '../Icons';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    if (!toasts.length) return;
    const timer = setTimeout(() => {
      onDismiss(toasts[0].id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-card toast-${toast.type}`} role="status">
          <div className="toast-icon">
            {toast.type === 'success' && <Icons.Check size={18} />}
            {toast.type === 'error' && <Icons.AlertTriangle size={18} />}
            {toast.type === 'warning' && <Icons.AlertTriangle size={18} />}
            {toast.type === 'info' && <Icons.Info size={18} />}
          </div>
          <div className="toast-content">
            <strong className="toast-title">{toast.title}</strong>
            {toast.description && <p className="toast-desc">{toast.description}</p>}
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Close notification"
          >
            <Icons.Close size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
