'use client';

import React from 'react';
import { CheckCircle2, AlertOctagon, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl p-4 border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 flex items-start space-x-3 ${
              isSuccess
                ? 'bg-slate-950/95 border-emerald-500/50 shadow-emerald-950/30'
                : isError
                ? 'bg-slate-950/95 border-rose-500/50 shadow-rose-950/30'
                : isWarning
                ? 'bg-slate-950/95 border-amber-500/50 shadow-amber-950/30'
                : 'bg-slate-950/95 border-indigo-500/50 shadow-indigo-950/30'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {isError && <AlertOctagon className="w-5 h-5 text-rose-400" />}
              {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-indigo-400" />}
            </div>

            <div className="flex-1 space-y-0.5">
              <h5 className="text-xs font-black text-white">{toast.title}</h5>
              <p className="text-[11px] text-slate-300 leading-snug">{toast.message}</p>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-slate-500 hover:text-white shrink-0 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
