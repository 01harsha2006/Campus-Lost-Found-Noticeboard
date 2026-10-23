import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ toasts = [], onDismiss }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="assertive">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`} role="status">
          {toast.type === 'success' && <CheckCircle2 size={18} color="var(--found-color)" />}
          {toast.type === 'error' && <AlertCircle size={18} color="var(--danger-color)" />}
          {toast.type === 'info' && <Info size={18} color="var(--primary)" />}
          <span style={{ flexGrow: 1 }}>{toast.message}</span>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            style={{ color: 'var(--text-dim)', padding: 2 }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
