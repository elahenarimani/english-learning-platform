// src/components/ui/toast/Toast.tsx

'use client';

import { ToastItem } from './toast.types';

type ToastProps = {
  toast: ToastItem;
  onClose: () => void;
};

export function Toast({
  toast,
  onClose,
}: ToastProps) {
  return (
    <div
      role="alert"
      className={`toast toast-${toast.type}`}
    >
      <span>{toast.message}</span>

      <button
        type="button"
        onClick={onClose}
        aria-label="بستن پیام"
      >
        ×
      </button>
    </div>
  );
}