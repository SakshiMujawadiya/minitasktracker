'use client';

import React, { useEffect } from 'react';
import { Task, TaskStatus, STATUS_LABELS, PRIORITY_LABELS } from '../../types/task';
import {
  X,
  Calendar,
  Edit3,
  Trash2,
  FileText,
  Tag,
  User,
  Equal,
  ArrowRight,
  ArrowUp,
} from 'lucide-react';
import AssigneeAvatar from '../common/AssigneeAvatar';

interface TaskDetailDrawerProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEditRequest: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  onStatusChange: (id: string, newStatus: TaskStatus) => Promise<void>;
}

export default function TaskDetailDrawer({
  task,
  isOpen,
  onClose,
  onEditRequest,
  onDeleteRequest,
  onStatusChange,
}: TaskDetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const statusStyles: Record<TaskStatus, { badge: string; dot: string }> = {
    todo: { badge: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' },
    in_progress: { badge: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
    done: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  };

  const priorityConfig = {
    low: { badge: 'bg-slate-50 text-slate-700 border-slate-200', icon: Equal },
    medium: { badge: 'bg-amber-50 text-amber-700 border-amber-200', icon: ArrowRight },
    high: { badge: 'bg-rose-50 text-rose-700 border-rose-200', icon: ArrowUp },
  }[task.priority] || { badge: 'bg-slate-50 text-slate-700 border-slate-200', icon: Equal };

  const PriorityIcon = priorityConfig.icon;

  const fullCreatedDate = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(task.createdAt));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-slide-left overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-task-title"
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusStyles[task.status].badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[task.status].dot}`} />
              <span>{STATUS_LABELS[task.status]}</span>
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${priorityConfig.badge}`}
            >
              <PriorityIcon className="w-3 h-3 stroke-[2.5]" />
              {PRIORITY_LABELS[task.priority]} Priority
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 flex-1 space-y-6">
          {/* Title */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              Task Title
            </span>
            <h2
              id="drawer-task-title"
              className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight break-words"
            >
              {task.title}
            </h2>
          </div>

          {/* Quick Status Select */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <label className="text-xs font-semibold text-slate-700 block">
              Workflow Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(task.id || (task._id as string), s)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    task.status === s
                      ? 'bg-white shadow-xs border-indigo-500 text-indigo-700 font-bold'
                      : 'bg-transparent border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Assignment Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Assignee
              </span>
              <div>
                {task.assignedTo ? (
                  <AssigneeAvatar name={task.assignedTo} size="sm" />
                ) : (
                  <span className="text-xs text-slate-400 italic">Unassigned</span>
                )}
              </div>
            </div>

            {task.dueDate && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Due Date
                </span>
                {(() => {
                  const due = new Date(task.dueDate);
                  const isOverdue = task.status !== 'done' && due < new Date();
                  return (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                        isOverdue
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      {due.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {isOverdue && ' (Overdue)'}
                    </span>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>Description</span>
            </div>
            {task.description ? (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
                {task.description}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200 text-center">
                <p className="text-xs text-slate-400 italic">No description provided for this task.</p>
              </div>
            )}
          </div>

          {/* Metadata Section */}
          <div className="border-t border-slate-100 pt-5 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                Created At
              </span>
              <span className="font-medium text-slate-800" suppressHydrationWarning>
                {fullCreatedDate}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Tag className="w-3.5 h-3.5" />
                Task ID
              </span>
              <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {task.id || task._id}
              </span>
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={() => {
              onClose();
              onDeleteRequest(task);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>

          <button
            onClick={() => {
              onClose();
              onEditRequest(task);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            Edit Task
          </button>
        </div>
      </div>
    </div>
  );
}
