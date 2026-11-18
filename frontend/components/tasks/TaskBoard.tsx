'use client';

import React from 'react';
import { Task, TaskStatus, STATUS_LABELS, PRIORITY_LABELS } from '../../types/task';
import {
  Plus,
  Trash2,
  Edit3,
  Calendar,
  CheckCircle2,
  Clock,
  ListTodo,
  ArrowRight,
  ArrowLeft,
  Check,
  Equal,
  ArrowUp,
} from 'lucide-react';
import AssigneeAvatar from '../common/AssigneeAvatar';

interface TaskBoardProps {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => Promise<void>;
  onEditRequest: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  onAddNewTaskWithStatus: (status: TaskStatus) => void;
  onOpenDetails?: (task: Task) => void;
}

export default function TaskBoard({
  tasks,
  onStatusChange,
  onEditRequest,
  onDeleteRequest,
  onAddNewTaskWithStatus,
  onOpenDetails,
}: TaskBoardProps) {
  const columns: {
    status: TaskStatus;
    label: string;
    icon: React.ElementType;
    dotColor: string;
    badgeColor: string;
  }[] = [
    {
      status: 'todo',
      label: 'To Do',
      icon: ListTodo,
      dotColor: 'bg-slate-400',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      status: 'in_progress',
      label: 'In Progress',
      icon: Clock,
      dotColor: 'bg-blue-500',
      badgeColor: 'bg-blue-50 text-blue-700',
    },
    {
      status: 'done',
      label: 'Done',
      icon: CheckCircle2,
      dotColor: 'bg-emerald-500',
      badgeColor: 'bg-emerald-50 text-emerald-700',
    },
  ];

  const priorityConfig = {
    low: {
      badge: 'bg-slate-50 text-slate-600 border-slate-200',
      icon: Equal,
      label: 'Low',
    },
    medium: {
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: ArrowRight,
      label: 'Medium',
    },
    high: {
      badge: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: ArrowUp,
      label: 'High',
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);

        return (
          <div
            key={col.status}
            className="bg-slate-100/70 rounded-2xl border border-slate-200/80 p-3.5 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {col.label}
                </h3>
                <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs tabular-nums">
                  {colTasks.length}
                </span>
              </div>
              <button
                onClick={() => onAddNewTaskWithStatus(col.status)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white transition-colors cursor-pointer"
                title={`Add task to ${col.label}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards in this Column */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[720px] pr-0.5">
              {colTasks.map((task) => {
                const priority =
                  priorityConfig[task.priority] || priorityConfig.medium;
                const PriorityIcon = priority.icon;
                const formattedDate = new Intl.DateTimeFormat('en-US', {
                  month: 'short',
                  day: 'numeric',
                }).format(new Date(task.createdAt));

                return (
                  <div
                    key={task.id || task._id}
                    onClick={() => onOpenDetails && onOpenDetails(task)}
                    className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all group cursor-pointer"
                  >
                    {/* Priority & Date */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priority.badge}`}
                      >
                        <PriorityIcon className="w-2.5 h-2.5 stroke-[2.5]" />
                        <span>{priority.label}</span>
                      </span>

                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h4
                      className={`text-xs sm:text-sm font-bold text-slate-900 leading-snug break-words group-hover:text-indigo-600 transition-colors ${
                        task.status === 'done' ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </h4>

                    {/* Description */}
                    {task.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Assignee & Due Date Pill */}
                    <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100 flex-wrap">
                      <div>
                        {task.assignedTo ? (
                          <AssigneeAvatar name={task.assignedTo} size="xs" />
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">Unassigned</span>
                        )}
                      </div>

                      {task.dueDate && (() => {
                        const due = new Date(task.dueDate);
                        const isOverdue = task.status !== 'done' && due < new Date();
                        return (
                          <span
                            suppressHydrationWarning
                            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                              isOverdue
                                ? 'bg-rose-50 text-rose-600 font-bold'
                                : 'text-slate-400'
                            }`}
                          >
                            {isOverdue ? 'Overdue' : due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        );
                      })()}
                    </div>

                    {/* Card Footer: Advance Buttons & Quick Actions */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1"
                    >
                      {/* Status Transition Shortcut */}
                      <div className="flex items-center gap-1">
                        {task.status !== 'todo' && (
                          <button
                            onClick={() =>
                              onStatusChange(
                                task.id || (task._id as string),
                                task.status === 'done' ? 'in_progress' : 'todo'
                              )
                            }
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Move back"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {task.status !== 'done' && (
                          <button
                            onClick={() =>
                              onStatusChange(
                                task.id || (task._id as string),
                                task.status === 'todo' ? 'in_progress' : 'done'
                              )
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 transition-colors"
                            title="Advance status"
                          >
                            <span>
                              {task.status === 'todo' ? 'Start' : 'Done'}
                            </span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                        {task.status === 'done' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            Done
                          </span>
                        )}
                      </div>

                      {/* Edit & Delete Actions */}
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => onEditRequest(task)}
                          className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit task"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteRequest(task)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="py-12 text-center rounded-xl border border-dashed border-slate-300 bg-white/40">
                  <p className="text-xs text-slate-400">No tasks in {col.label}</p>
                  <button
                    onClick={() => onAddNewTaskWithStatus(col.status)}
                    className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    + Add Task
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
