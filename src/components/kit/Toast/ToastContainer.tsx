// src/components/ui/toast/ToastContainer.tsx

'use client';

import { useEffect, useState } from 'react';

import { toast } from './toast';
import { Toast } from './Toast';
import { ToastItem } from './toast.types';

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  return (
    <div
      className="toast-container"
      aria-live="polite"
    >
      {toasts.map((item) => (
        <Toast
          key={item.id}
          toast={item}
          onClose={() => toast.remove(item.id)}
        />
      ))}
    </div>
  );
}