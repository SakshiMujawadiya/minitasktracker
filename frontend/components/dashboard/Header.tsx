'use client';

import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  Menu,
  CheckCircle2,
  LayoutList,
  Kanban,
  Command,
  Download,
  FileSpreadsheet,
  FileCode,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';

interface HeaderProps {
  onAddNewTask: () => void;
  onOpenMobileMenu?: () => void;
  onOpenCommandPalette: () => void;
  viewMode: 'list' | 'board';
  onToggleViewMode: (mode: 'list' | 'board') => void;
  totalTasks: number;
  completedTasks: number;
  onExportCSV: () => void;
  onExportJSON: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebarCollapse?: () => void;
}

export default function Header({
  onAddNewTask,
  onOpenMobileMenu,
  onOpenCommandPalette,
  viewMode,
  onToggleViewMode,
  totalTasks,
  completedTasks,
  onExportCSV,
  onExportJSON,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
}: HeaderProps) {
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [today, setToday] = useState('');

  React.useEffect(() => {
    setToday(
      new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(new Date())
    );
  }, []);

  const completionPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <header className="pb-6 border-b border-slate-200/80">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section: Breadcrumb, Title & Progress Pill */}
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          {onOpenMobileMenu && (
            <button
              onClick={onOpenMobileMenu}
              className="md:hidden p-2 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          {/* Desktop Sidebar Toggle Button */}
          {onToggleSidebarCollapse && (
            <button
              onClick={onToggleSidebarCollapse}
              className="hidden md:flex p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? (
                <PanelLeft className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Workspace
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5" suppressHydrationWarning>
                <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                {today || 'Today'}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Tasks Dashboard
              </h1>

              {/* Compact completion badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {completionPercentage}% completed
                </span>
                <span className="text-emerald-500 font-normal">
                  ({completedTasks}/{totalTasks})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: View Mode, Search, Export & CTA */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto flex-wrap">
          {/* Quick Search / Command Palette Pill */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-600 rounded-xl text-xs font-medium shadow-subtle transition-all cursor-pointer"
            title="Open Command Palette (Ctrl+K)"
          >
            <Command className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search tasks...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono border border-slate-200">
              ⌘K
            </kbd>
          </button>

          {/* Segmented View Mode Switcher */}
          <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              onClick={() => onToggleViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="List View"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => onToggleViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'board'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
          </div>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="p-2 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-slate-300 text-slate-600 rounded-xl text-xs font-medium shadow-subtle transition-colors cursor-pointer"
              title="Export tasks"
            >
              <Download className="w-4 h-4" />
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-popover border border-slate-200 py-1.5 z-30 animate-scale-in">
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportCSV();
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Export as CSV</span>
                </button>
                <button
                  onClick={() => {
                    setIsExportMenuOpen(false);
                    onExportJSON();
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-blue-600" />
                  <span>Export as JSON</span>
                </button>
              </div>
            )}
          </div>

          {/* Primary Action: New Task Button */}
          <button
            onClick={onAddNewTask}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm shadow-indigo-600/30 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
