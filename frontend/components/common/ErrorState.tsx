'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-rose-50/60 rounded-2xl border border-rose-200/80 p-10 text-center shadow-xs">
      <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-900">Something went wrong</h3>
      <p className="text-sm text-rose-700 mt-1 max-w-md mx-auto">{message}</p>
      <button
        onClick={onRetry}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold rounded-lg shadow-xs shadow-rose-600/20 transition-colors cursor-pointer"
      >
        <RefreshCw className="w-4 h-4" />
        Retry Connection
      </button>
    </div>
  );
}

