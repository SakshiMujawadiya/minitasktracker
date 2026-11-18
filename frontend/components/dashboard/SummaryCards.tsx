'use client';

import React from 'react';
import { ListChecks, ListTodo, Clock, CheckCircle2, TrendingUp } from 'lucide-react';

interface SummaryCardsProps {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  activeFilter: string;
  onFilterClick: (filter: string) => void;
}

export default function SummaryCards({
  total,
  todo,
  inProgress,
  completed,
  activeFilter,
  onFilterClick,
}: SummaryCardsProps) {
  const cards = [
    {
      id: 'all',
      title: 'Total Pipeline',
      count: total,
      meta: 'All recorded tasks',
      percentage: 100,
      icon: ListChecks,
      theme: {
        text: 'text-indigo-600',
        bg: 'bg-indigo-50',
        border: 'border-indigo-100',
        bar: 'bg-indigo-500',
        activeCard: 'ring-2 ring-indigo-500 border-indigo-300 bg-indigo-50/20',
      },
    },
    {
      id: 'todo',
      title: 'Pending To Do',
      count: todo,
      meta: total > 0 ? `${Math.round((todo / total) * 100)}% of total` : '0%',
      percentage: total > 0 ? (todo / total) * 100 : 0,
      icon: ListTodo,
      theme: {
        text: 'text-slate-700',
        bg: 'bg-slate-100',
        border: 'border-slate-200',
        bar: 'bg-slate-400',
        activeCard: 'ring-2 ring-slate-400 border-slate-300 bg-slate-50/50',
      },
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      count: inProgress,
      meta: total > 0 ? `${Math.round((inProgress / total) * 100)}% of total` : '0%',
      percentage: total > 0 ? (inProgress / total) * 100 : 0,
      icon: Clock,
      theme: {
        text: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        bar: 'bg-blue-500',
        activeCard: 'ring-2 ring-blue-500 border-blue-300 bg-blue-50/20',
      },
    },
    {
      id: 'done',
      title: 'Completed',
      count: completed,
      meta: total > 0 ? `${Math.round((completed / total) * 100)}% completion` : '0%',
      percentage: total > 0 ? (completed / total) * 100 : 0,
      icon: CheckCircle2,
      theme: {
        text: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        bar: 'bg-emerald-500',
        activeCard: 'ring-2 ring-emerald-500 border-emerald-300 bg-emerald-50/20',
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = activeFilter === card.id;

        return (
          <button
            key={card.id}
            onClick={() => onFilterClick(card.id)}
            className={`bg-white rounded-2xl border p-4 sm:p-5 text-left transition-all cursor-pointer shadow-subtle hover:shadow-card hover:border-slate-300 relative overflow-hidden group ${
              isActive ? card.theme.activeCard : 'border-slate-200/80'
            }`}
          >
            {/* Top Row: Title + Icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${card.theme.bg} ${card.theme.text} ${card.theme.border}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>

            {/* Main Metric */}
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums">
                {card.count}
              </span>
              <span className="text-[11px] font-medium text-slate-400 tabular-nums hidden sm:inline">
                {card.meta}
              </span>
            </div>

            {/* Bottom Mini Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
              <div
                className={`h-1 rounded-full transition-all duration-500 ${card.theme.bar}`}
                style={{ width: `${Math.min(100, Math.max(4, card.percentage))}%` }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}
