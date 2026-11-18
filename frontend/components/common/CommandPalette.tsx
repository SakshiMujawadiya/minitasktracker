'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  LayoutList,
  Kanban,
  Download,
  RotateCcw,
  ListChecks,
  ListTodo,
  Clock,
  CheckCircle2,
  X,
  Command,
} from 'lucide-react';
import { Task, TaskStatus } from '../../types/task';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onAddNewTask: () => void;
  onSelectFilter: (status: string) => void;
  viewMode: 'list' | 'board';
  onToggleViewMode: (mode: 'list' | 'board') => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onResetFilters: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
  tasks,
  onSelectTask,
  onAddNewTask,
  onSelectFilter,
  viewMode,
  onToggleViewMode,
  onExportCSV,
  onExportJSON,
  onResetFilters,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global hotkey Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via parent
          const event = new CustomEvent('open-command-palette');
          window.dispatchEvent(event);
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filtered tasks
  const matchedTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase().trim())
  ).slice(0, 5);

  const commandItems = [
    {
      id: 'create-task',
      label: 'Create New Task',
      category: 'Actions',
      icon: Plus,
      action: () => {
        onClose();
        onAddNewTask();
      },
    },
    {
      id: 'toggle-view',
      label: viewMode === 'list' ? 'Switch to Board View' : 'Switch to List View',
      category: 'Actions',
      icon: viewMode === 'list' ? Kanban : LayoutList,
      action: () => {
        onClose();
        onToggleViewMode(viewMode === 'list' ? 'board' : 'list');
      },
    },
    {
      id: 'filter-all',
      label: 'Filter: All Tasks',
      category: 'Views',
      icon: ListChecks,
      action: () => {
        onClose();
        onSelectFilter('all');
      },
    },
    {
      id: 'filter-todo',
      label: 'Filter: To Do',
      category: 'Views',
      icon: ListTodo,
      action: () => {
        onClose();
        onSelectFilter('todo');
      },
    },
    {
      id: 'filter-in-progress',
      label: 'Filter: In Progress',
      category: 'Views',
      icon: Clock,
      action: () => {
        onClose();
        onSelectFilter('in_progress');
      },
    },
    {
      id: 'filter-done',
      label: 'Filter: Done',
      category: 'Views',
      icon: CheckCircle2,
      action: () => {
        onClose();
        onSelectFilter('done');
      },
    },
    {
      id: 'export-csv',
      label: 'Export Tasks as CSV',
      category: 'Export',
      icon: Download,
      action: () => {
        onClose();
        onExportCSV();
      },
    },
    {
      id: 'export-json',
      label: 'Export Tasks as JSON',
      category: 'Export',
      icon: Download,
      action: () => {
        onClose();
        onExportJSON();
      },
    },
    {
      id: 'reset-filters',
      label: 'Reset All Filters & Search',
      category: 'Actions',
      icon: RotateCcw,
      action: () => {
        onClose();
        onResetFilters();
      },
    },
  ].filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-xl overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search tasks..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-100 rounded border border-slate-200">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Matched Tasks Section */}
          {matchedTasks.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Matching Tasks ({matchedTasks.length})
              </div>
              <div className="space-y-0.5">
                {matchedTasks.map((t) => (
                  <button
                    key={t.id || t._id}
                    onClick={() => {
                      onClose();
                      onSelectTask(t);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-slate-50 transition-colors text-left group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          t.status === 'done'
                            ? 'bg-emerald-500'
                            : t.status === 'in_progress'
                            ? 'bg-blue-500'
                            : 'bg-slate-400'
                        }`}
                      />
                      <span className="font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                        {t.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-2 py-0.5 bg-slate-100 rounded-md">
                      {t.status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Commands Section */}
          {commandItems.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Commands
              </div>
              <div className="space-y-0.5">
                {commandItems.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-900 transition-colors text-left cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                        <span>{cmd.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-indigo-500">
                        {cmd.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {matchedTasks.length === 0 && commandItems.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or tasks found.
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigation: <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">↑↓</kbd> to navigate</span>
          <span>Open anytime with <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">Ctrl + K</kbd></span>
        </div>
      </div>
    </div>
  );
}

