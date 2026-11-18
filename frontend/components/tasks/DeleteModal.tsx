'use client';

import React, { useState } from 'react';
import { Task } from '../../types/task';
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

export default function DeleteModal({
  task,
  isOpen,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !task) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      await onConfirm(task.id || (task._id as string));
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to delete task.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-full max-w-md p-6 overflow-hidden animate-scale-in"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-desc"
      >
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900">
          Delete Task
        </h3>

        <p id="delete-dialog-desc" className="text-sm text-slate-500 mt-2 leading-relaxed">
          Are you sure you want to permanently delete{' '}
          <strong className="text-slate-900 font-semibold break-words">
            "{task.title}"
          </strong>
          ? This action cannot be undone.
        </p>

        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-xs shadow-rose-600/25 transition-all cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Task</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

