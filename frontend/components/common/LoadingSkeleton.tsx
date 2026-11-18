'use client';

import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs animate-pulse"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2.5 flex-1">
              <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
              <div className="h-4 bg-slate-100 rounded-md w-2/3"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
              <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 bg-slate-100 rounded-md w-24"></div>
            <div className="h-8 bg-slate-200 rounded-lg w-28"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

