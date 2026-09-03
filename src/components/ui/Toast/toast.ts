// src/components/ui/toast/toast.ts
'use client';
import { ToastItem, ToastType } from './toast.types';

type ToastListener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];

const listeners = new Set<ToastListener>();

const notify = () => {
  listeners.forEach((listener) => {
    listener([...toasts]);
  });
};

const remove = (id: string) => {
  toasts = toasts.filter((toast) => toast.id !== id);

  notify();
};

const add = (
  type: ToastType,
  message: string,
  duration = 3000
) => {
  const id = crypto.randomUUID();

  const newToast: ToastItem = {
    id,
    message,
    type,
    duration,
  };

  toasts = [...toasts, newToast];

  notify();

  if (duration > 0) {
    setTimeout(() => {
      remove(id);
    }, duration);
  }

  return id;
};

export const toast = {
  success: (message: string, duration?: number) =>
    add('success', message, duration),

  error: (message: string, duration?: number) =>
    add('error', message, duration),

  warning: (message: string, duration?: number) =>
    add('warning', message, duration),

  info: (message: string, duration?: number) =>
    add('info', message, duration),

  remove,

  subscribe: (listener: ToastListener) => {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};