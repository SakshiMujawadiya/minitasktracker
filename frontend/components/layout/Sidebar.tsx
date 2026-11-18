'use client';

import React, { useState } from 'react';
import {
  ListTodo,
  Clock,
  CheckCircle2,
  ListChecks,
  Layers,
  History,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentFilter: string;
  onSelectFilter: (filter: string) => void;
  counts: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  currentFilter,
  onSelectFilter,
  counts,
  isMobileOpen = false,
  onMobileClose,
  isCollapsed: controlledCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  // Support either controlled or local collapse state
  const [localCollapsed, setLocalCollapsed] = useState(false);
  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : localCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setLocalCollapsed(!localCollapsed));

  const views = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: ListChecks,
      count: counts.total,
      color: 'text-indigo-600',
    },
    {
      id: 'todo',
      label: 'To Do',
      icon: ListTodo,
      count: counts.todo,
      color: 'text-slate-500',
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      icon: Clock,
      count: counts.inProgress,
      color: 'text-blue-500',
    },
    {
      id: 'done',
      label: 'Done',
      icon: CheckCircle2,
      count: counts.done,
      color: 'text-emerald-500',
    },
  ];

  const sidebarContent = (
    <aside
      className={`bg-white border-r border-slate-200/80 flex flex-col h-full select-none shadow-[1px_0_0_0_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Workspace Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between min-h-[69px]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-tight text-slate-900 truncate">
                  TaskFlow
                </span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">Workspace</p>
            </div>
          )}
        </div>

        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="p-3 flex-1 overflow-y-auto space-y-6">
        {/* Core Views */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider animate-fade-in">
              <span>Workflow Views</span>
            </div>
          )}
          <nav className="space-y-1">
            {views.map((item) => {
              const Icon = item.icon;
              const isActive = currentFilter === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectFilter(item.id);
                    if (onMobileClose) onMobileClose();
                  }}
                  title={isCollapsed ? `${item.label} (${item.count})` : undefined}
                  className={`w-full flex items-center rounded-xl text-xs font-medium transition-all cursor-pointer group relative ${
                    isCollapsed
                      ? 'justify-center p-2.5'
                      : 'justify-between px-3 py-2'
                  } ${
                    isActive
                      ? 'bg-indigo-50/90 text-indigo-900 font-semibold shadow-xs border border-indigo-100/80'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-colors ${
                        isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed ? (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold tabular-nums transition-colors ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80'
                      }`}
                    >
                      {item.count}
                    </span>
                  ) : (
                    item.count > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
                    )
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Analytics & History */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider animate-fade-in">
              Timeline & History
            </div>
          )}
          <nav className="space-y-1">
            <button
              onClick={() => {
                onSelectFilter('history');
                if (onMobileClose) onMobileClose();
              }}
              title={isCollapsed ? 'Task History' : undefined}
              className={`w-full flex items-center rounded-xl text-xs font-medium transition-all cursor-pointer group ${
                isCollapsed
                  ? 'justify-center p-2.5'
                  : 'justify-between px-3 py-2'
              } ${
                currentFilter === 'history'
                  ? 'bg-indigo-50/90 text-indigo-900 font-semibold shadow-xs border border-indigo-100/80'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <History
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    currentFilter === 'history'
                      ? 'text-indigo-600'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                {!isCollapsed && <span className="truncate">Task History</span>}
              </div>
              {!isCollapsed && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 group-hover:bg-slate-200">
                  By Date
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* User / Workspace Profile Footer */}
      <div className={`border-t border-slate-100 flex items-center ${isCollapsed ? 'p-3 justify-center' : 'p-3.5 justify-between'}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-xs select-none flex-shrink-0"
            title={isCollapsed ? 'Jane Doe (Lead Developer)' : undefined}
          >
            JD
          </div>
          {!isCollapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="text-xs font-semibold text-slate-800 truncate">Jane Doe</p>
              <p className="text-[10px] text-slate-400 truncate">Lead Developer</p>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500">
            v2.2
          </span>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onMobileClose}
          />
          <div className="relative z-10 h-full animate-slide-right">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
