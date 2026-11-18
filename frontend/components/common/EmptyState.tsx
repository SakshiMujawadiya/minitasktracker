'use client';

import React from 'react';
import { ClipboardList, SearchX, Plus, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered?: boolean;
  onActionClick: () => void;
}

export default function EmptyState({ isFiltered = false, onActionClick }: EmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No tasks found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          No tasks match your current filter or search query. Try clearing filters to see all tasks.
        </p>
        <button
          onClick={onActionClick}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        <ClipboardList className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">No tasks yet</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
        Your task tracker is clear. Create your first task to plan, prioritize, and track your workflow.
      </p>
      <button
        onClick={onActionClick}
        className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-xs shadow-indigo-600/20 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        Add Your First Task
      </button>
    </div>
  );
}

