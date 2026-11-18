'use client';

import React from 'react';
import { Search, X, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import {
  STATUS_OPTIONS,
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
  SortOption,
} from '../../types/task';

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentStatus: string;
  onStatusChange: (status: string) => void;
  currentPriority: string;
  onPriorityChange: (priority: string) => void;
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFilteredCount: number;
  onResetFilters: () => void;
  isFiltered: boolean;
}

export default function TaskFilterBar({
  searchQuery,
  onSearchChange,
  currentStatus,
  onStatusChange,
  currentPriority,
  onPriorityChange,
  currentSort,
  onSortChange,
  totalFilteredCount,
  onResetFilters,
  isFiltered,
}: TaskFilterBarProps) {
  const statusTabs = [{ value: 'all', label: 'All Status' }, ...STATUS_OPTIONS];

  return (
    <div className="space-y-3 mb-6">
      {/* Top Controls: Search + Dropdowns */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, description, or keyword..."
            className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-subtle transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 transition-colors p-1"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right Controls: Priority Filter + Sort Dropdown */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-3 py-2 shadow-subtle hover:border-slate-300 transition-colors">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentPriority}
              onChange={(e) => onPriorityChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              aria-label="Filter by priority"
            >
              <option value="all">All Priorities</option>
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} Priority
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-3 py-2 shadow-subtle hover:border-slate-300 transition-colors">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentSort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              aria-label="Sort tasks"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters button */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="text-xs font-semibold text-slate-600 hover:text-rose-600 bg-white hover:bg-rose-50 border border-slate-200/90 hover:border-rose-200 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-subtle cursor-pointer"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom Status Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/70 overflow-x-auto select-none">
        {statusTabs.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onStatusChange(tab.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
