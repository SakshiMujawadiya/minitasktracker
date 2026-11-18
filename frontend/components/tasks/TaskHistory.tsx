'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HistoryDay, HistoryMonth, Task, STATUS_LABELS, PRIORITY_LABELS } from '../../types/task';
import {
  History,
  ChevronDown,
  ChevronRight,
  Calendar,
  CheckCircle2,
  Clock,
  Circle,
  Loader2,
  AlertCircle,
  RefreshCw,
  Sparkles,
  CalendarDays,
  Filter,
} from 'lucide-react';
import AssigneeAvatar from '../common/AssigneeAvatar';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const statusStyles: Record<string, string> = {
  todo: 'bg-slate-100 text-slate-700 border-slate-200',
  in_progress: 'bg-blue-50 text-blue-700 border-blue-200',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const priorityStyles: Record<string, string> = {
  low: 'text-slate-500 bg-slate-50 border-slate-200',
  medium: 'text-amber-700 bg-amber-50 border-amber-200',
  high: 'text-rose-700 bg-rose-50 border-rose-200',
};

function StatusIcon({ status }: { status: string }) {
  if (status === 'done') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
  if (status === 'in_progress') return <Clock className="w-4 h-4 text-blue-500" />;
  return <Circle className="w-4 h-4 text-slate-400" />;
}

function TaskRow({ task }: { task: Task }) {
  const dueDateStr = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    : null;
  const isOverdue =
    task.dueDate && task.status !== 'done' && new Date(task.dueDate) < new Date();

  return (
    <div className="flex items-center justify-between gap-4 py-3 px-3.5 rounded-xl hover:bg-slate-50/90 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <StatusIcon status={task.status} />
        <div className="min-w-0">
          <p
            className={`text-xs sm:text-sm font-semibold text-slate-900 truncate ${
              task.status === 'done' ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-slate-400 truncate mt-0.5">{task.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-shrink-0">
        {/* Assignee Avatar */}
        {task.assignedTo && (
          <AssigneeAvatar name={task.assignedTo} size="xs" />
        )}

        {/* Priority Badge */}
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
            priorityStyles[task.priority] || priorityStyles.low
          }`}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>

        {/* Due Date */}
        {dueDateStr && (
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
              isOverdue
                ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200'
                : 'text-slate-400 bg-slate-100'
            }`}
          >
            {isOverdue ? 'Overdue · ' : 'Due '}
            {dueDateStr}
          </span>
        )}
      </div>
    </div>
  );
}

function DayTimelineGroup({ group }: { group: HistoryDay }) {
  const [expanded, setExpanded] = useState(true);

  const dateObj = new Date(group.date + 'T00:00:00');
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const dayNumber = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="relative pl-8 sm:pl-10 pb-6 group">
      {/* Vertical Timeline Track Line */}
      <div className="absolute left-3.5 sm:left-4.5 top-5 bottom-0 w-0.5 bg-slate-200 group-last:hidden" />

      {/* Timeline Node Badge */}
      <div className="absolute left-0 sm:left-1 top-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-indigo-500 shadow-xs flex items-center justify-center text-[11px] font-bold text-indigo-700 select-none">
        {dayNumber}
      </div>

      {/* Timeline Content Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle overflow-hidden">
        {/* Day Header Accordion */}
        <button
          onClick={() => setExpanded((p) => !p)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/80 hover:bg-slate-100/70 transition-colors text-left cursor-pointer border-b border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            {expanded ? (
              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {dayName}, {monthName}
                </span>
                <span className="text-[11px] font-bold text-slate-500 px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-2xs">
                  {group.count} task{group.count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Mini Status Breakdown */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              {group.done} completed
            </span>
            {group.inProgress > 0 && (
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 hidden sm:inline">
                {group.inProgress} in progress
              </span>
            )}
          </div>
        </button>

        {/* Task Items */}
        {expanded && (
          <div className="divide-y divide-slate-100 p-1">
            {group.tasks.map((task) => (
              <TaskRow key={task.id || task._id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TaskHistory() {
  const [months, setMonths] = useState<HistoryMonth[]>([]);
  const [history, setHistory] = useState<HistoryDay[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isLoadingMonths, setIsLoadingMonths] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonths = useCallback(async () => {
    try {
      setIsLoadingMonths(true);
      const res = await fetch(`${API_BASE}/tasks/history/months`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setMonths(json.data);
        if (json.data.length > 0) {
          setSelectedYear(String(json.data[0].year));
          setSelectedMonth(String(json.data[0].month));
        } else {
          const now = new Date();
          setSelectedYear(String(now.getFullYear()));
          setSelectedMonth(String(now.getMonth() + 1));
        }
      }
    } catch {
      setError('Unable to load history metadata.');
    } finally {
      setIsLoadingMonths(false);
    }
  }, []);

  const fetchHistory = useCallback(async (year: string, month: string) => {
    if (!year) return;
    try {
      setIsLoadingHistory(true);
      setError(null);
      const params = new URLSearchParams({ year });
      if (month) params.set('month', month);
      const res = await fetch(`${API_BASE}/tasks/history?${params}`);
      const json = await res.json();
      if (json.success) {
        setHistory(json.data);
      } else {
        setError('Failed to load task history.');
      }
    } catch {
      setError('Failed to connect to the backend server.');
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    fetchMonths();
  }, [fetchMonths]);

  useEffect(() => {
    if (selectedYear) {
      fetchHistory(selectedYear, selectedMonth);
    }
  }, [selectedYear, selectedMonth, fetchHistory]);

  const totalTasks = history.reduce((sum, d) => sum + d.count, 0);
  const totalDone = history.reduce((sum, d) => sum + d.done, 0);
  const totalInProgress = history.reduce((sum, d) => sum + d.inProgress, 0);
  const totalTodo = history.reduce((sum, d) => sum + d.todo, 0);
  const completionRate = totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0;

  const uniqueYears = Array.from(new Set(months.map((m) => m.year))).sort((a, b) => b - a);
  if (uniqueYears.length === 0) {
    uniqueYears.push(new Date().getFullYear());
  }

  const monthsForYear = months.filter((m) => String(m.year) === selectedYear);

  const monthNames = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-indigo-600" />
            Task History & Timeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse and inspect task creation history filtered by year and month.
          </p>
        </div>

        {/* Date Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Year Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-3 py-2 shadow-subtle">
            <span className="text-xs font-semibold text-slate-400">Year</span>
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSelectedMonth('');
              }}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              disabled={isLoadingMonths}
            >
              {uniqueYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-3 py-2 shadow-subtle">
            <span className="text-xs font-semibold text-slate-400">Month</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
              disabled={isLoadingMonths}
            >
              <option value="">All Months</option>
              {monthsForYear.length > 0 ? (
                monthsForYear.map((m) => (
                  <option key={m.month} value={m.month}>
                    {monthNames[m.month]} ({m.count})
                  </option>
                ))
              ) : (
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                  <option key={m} value={m}>
                    {monthNames[m]}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => fetchHistory(selectedYear, selectedMonth)}
            disabled={isLoadingHistory || !selectedYear}
            className="p-2 bg-white border border-slate-200/90 rounded-xl text-slate-500 hover:text-indigo-600 hover:border-indigo-200 shadow-subtle transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh history"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingHistory ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Aggregate Metric Highlight Banner */}
      {!isLoadingHistory && history.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-subtle">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Recorded
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              {totalTasks}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
              Completed
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 mt-0.5">
              {totalDone}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
              In Progress
            </span>
            <p className="text-xl sm:text-2xl font-extrabold text-blue-600 mt-0.5">
              {totalInProgress}
            </p>
          </div>
          <div>
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              Completion Rate
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-600">
                {completionRate}%
              </span>
              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline Stream */}
      {isLoadingHistory ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-400">
          <Loader2 className="w-7 h-7 animate-spin text-indigo-600 mb-2" />
          <span className="text-xs font-semibold">Loading timeline history...</span>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      ) : history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-slate-200/80 p-8 shadow-subtle">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No Task History Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            No tasks were created during {selectedMonth ? monthNames[Number(selectedMonth)] : ''} {selectedYear}. Select another month or year from the dropdown above.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          {history.map((group) => (
            <DayTimelineGroup key={group.date} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
