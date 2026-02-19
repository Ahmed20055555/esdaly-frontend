'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 3500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  return (
    <div
      className="fixed bottom-4 right-4 left-4 sm:left-auto z-[9999] flex flex-col gap-2 max-w-sm pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto rounded-xl shadow-lg border px-4 py-3 flex items-center gap-3
            transition-all duration-300
            ${
              t.type === 'success'
                ? 'bg-[#0B3D2E] text-white border-[#0B3D2E]'
                : t.type === 'error'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-gray-800 text-white border-gray-700'
            }
          `}
        >
          <span className="flex-1 text-sm font-medium">{t.message}</span>
          <button
            type="button"
            onClick={() => removeToast(t.id)}
            className="text-white/80 hover:text-white p-1 rounded"
            aria-label="إغلاق"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      showToast: (_message: string, _type?: ToastType) => {},
    };
  }
  return ctx;
}
