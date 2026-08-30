'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newToast: Toast = { ...toast, id };

    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4500;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Notification Container (Top-Centered Mobile-First) */}
      <div 
        role="region"
        aria-label="Notifications"
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm sm:max-w-md w-[calc(100%-1.5rem)] sm:w-full pointer-events-none px-0"
      >
        {toasts.map((toast) => {
          const bgColors = {
            success: 'bg-slate-900/95 border-emerald-500/50 text-emerald-100 shadow-xl shadow-black/20',
            error: 'bg-slate-900/95 border-rose-500/50 text-rose-100 shadow-xl shadow-black/20',
            warning: 'bg-slate-900/95 border-amber-500/50 text-amber-100 shadow-xl shadow-black/20',
            info: 'bg-slate-900/95 border-blue-500/50 text-blue-100 shadow-xl shadow-black/20',
          }[toast.type];

          const Icon = {
            success: CheckCircle2,
            error: AlertCircle,
            warning: AlertTriangle,
            info: Info,
          }[toast.type];

          const iconColors = {
            success: 'text-emerald-400',
            error: 'text-rose-400',
            warning: 'text-amber-400',
            info: 'text-blue-400',
          }[toast.type];

          return (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto flex items-start gap-3 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${bgColors}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${iconColors}`} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight text-white">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed break-words">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
