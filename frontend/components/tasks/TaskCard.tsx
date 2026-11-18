'use client';

import React, { useState } from 'react';
import { Task, TaskStatus, STATUS_LABELS, PRIORITY_LABELS } from '../../types/task';
import {
  Trash2,
  Edit3,
  Calendar,
  Loader2,
  CheckCircle2,
  Circle,
  Clock,
  ArrowUp,
  ArrowRight,
  Equal,
  ChevronRight,
} from 'lucide-react';
import AssigneeAvatar from '../common/AssigneeAvatar';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => Promise<void>;
  onEditRequest: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  onOpenDetails?: (task: Task) => void;
}

export default function TaskCard({
  task,
  onStatusChange,
  onEditRequest,
  onDeleteRequest,
  onOpenDetails,
}: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  // Status Styling
  const statusStyles: Record<TaskStatus, { badge: string; dot: string }> = {
    todo: {
      badge: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
    },
    in_progress: {
      badge: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    done: {
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
  };

  // Priority Styling with Icons
  const priorityConfig = {
    low: {
      badge: 'bg-slate-50 text-slate-600 border-slate-200',
      icon: Equal,
      label: 'Low',
      dot: 'bg-slate-400',
    },
    medium: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: ArrowRight,
      label: 'Medium',
      dot: 'bg-amber-500',
    },
    high: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: ArrowUp,
      label: 'High',
      dot: 'bg-rose-500',
    },
  }[task.priority] || {
    badge: 'bg-slate-50 text-slate-600 border-slate-200',
    icon: Equal,
    label: 'Low',
    dot: 'bg-slate-400',
  };

  const PriorityIcon = priorityConfig.icon;
  const isDone = task.status === 'done';

  const formattedCreatedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(task.createdAt));

  // Toggle status shortcut: todo -> in_progress -> done -> todo
  const handleToggleStatus = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUpdating) return;
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    };
    setIsUpdating(true);
    try {
      await onStatusChange(task.id || (task._id as string), nextStatus[task.status]);
    } finally {
      setIsUpdating(false);
    }
  };

  // Select dropdown status change
  const handleSelectStatus = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const newStatus = e.target.value as TaskStatus;
    if (newStatus === task.status || isUpdating) return;

    setIsUpdating(true);
    try {
      await onStatusChange(task.id || (task._id as string), newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(task)}
      className={`bg-white rounded-2xl border p-4 sm:p-5 transition-all shadow-subtle hover:shadow-card hover:border-slate-300 group cursor-pointer relative overflow-hidden ${
        isDone ? 'border-slate-200/60 bg-slate-50/40' : 'border-slate-200/90'
      }`}
    >
      {/* Accent strip on hover */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${
          isDone
            ? 'bg-emerald-400'
            : task.status === 'in_progress'
            ? 'bg-blue-500'
            : 'bg-transparent group-hover:bg-indigo-500'
        }`}
      />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 pl-1">
        {/* Left Side: Checkbox Circle + Title + Description + Tags */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Quick status cycle button */}
          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors p-0.5 rounded-full hover:bg-slate-100"
            title={`Status: ${STATUS_LABELS[task.status]}. Click to advance.`}
          >
            {isUpdating ? (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            ) : isDone ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
            ) : task.status === 'in_progress' ? (
              <Clock className="w-5 h-5 text-blue-500" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* Badges Bar: Status + Priority + Assignee */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {/* Status Pill */}
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusStyles[task.status].badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusStyles[task.status].dot}`} />
                <span>{STATUS_LABELS[task.status]}</span>
              </span>

              {/* Priority Pill */}
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityConfig.badge}`}
              >
                <PriorityIcon className="w-3 h-3 stroke-[2.5]" />
                <span>{priorityConfig.label}</span>
              </span>

              {/* Assignee Avatar */}
              {task.assignedTo && (
                <AssigneeAvatar name={task.assignedTo} size="xs" />
              )}
            </div>

            {/* Task Title */}
            <h3
              className={`text-sm sm:text-base font-bold text-slate-900 leading-snug break-words transition-colors ${
                isDone ? 'line-through text-slate-400' : 'group-hover:text-indigo-600'
              }`}
            >
              {task.title}
            </h3>

            {/* Description Snippet */}
            {task.description && (
              <p className="text-xs sm:text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Timestamps & Due Dates */}
            <div className="flex items-center flex-wrap gap-3 mt-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1" suppressHydrationWarning>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Added {formattedCreatedDate}</span>
              </div>

              {task.dueDate && (() => {
                const due = new Date(task.dueDate);
                const isOverdue = task.status !== 'done' && due < new Date();
                return (
                  <div
                    suppressHydrationWarning
                    className={`flex items-center gap-1 font-medium px-2 py-0.5 rounded-md ${
                      isOverdue
                        ? 'bg-rose-50 text-rose-600 border border-rose-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    <span>
                      {isOverdue ? 'Overdue · ' : 'Due '}
                      {due.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Right Side: Status Select & Action Toolbar */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center sm:self-center gap-2 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0"
        >
          {/* Status Quick Switch Dropdown */}
          <div className="relative">
            <select
              value={task.status}
              disabled={isUpdating}
              onChange={handleSelectStatus}
              className="text-xs font-semibold bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-1.5 pl-2.5 pr-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors disabled:opacity-60"
              aria-label={`Change status for ${task.title}`}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {/* Edit Task Action Button */}
          <button
            onClick={() => onEditRequest(task)}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            title="Edit task"
            aria-label={`Edit task ${task.title}`}
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Task Action Button */}
          <button
            onClick={() => onDeleteRequest(task)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Delete task"
            aria-label={`Delete task ${task.title}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Details Arrow */}
          <button
            onClick={() => onOpenDetails && onOpenDetails(task)}
            className="p-1 text-slate-300 group-hover:text-slate-500 transition-colors hidden sm:block"
            title="View details"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
