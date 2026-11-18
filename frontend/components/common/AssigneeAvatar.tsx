'use client';

import React from 'react';
import { User } from 'lucide-react';

interface AssigneeAvatarProps {
  name?: string;
  size?: 'xs' | 'sm' | 'md';
  showName?: boolean;
  className?: string;
}

const COLOR_PAIRS = [
  { bg: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  { bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { bg: 'bg-violet-100 text-violet-700 border-violet-200' },
  { bg: 'bg-amber-100 text-amber-800 border-amber-200' },
  { bg: 'bg-rose-100 text-rose-700 border-rose-200' },
  { bg: 'bg-cyan-100 text-cyan-800 border-cyan-200' },
  { bg: 'bg-sky-100 text-sky-700 border-sky-200' },
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COLOR_PAIRS.length;
}

export default function AssigneeAvatar({
  name,
  size = 'sm',
  showName = true,
  className = '',
}: AssigneeAvatarProps) {
  if (!name || !name.trim()) {
    return null;
  }

  const trimmed = name.trim();
  const initials = getInitials(trimmed);
  const color = COLOR_PAIRS[getColorIndex(trimmed)];

  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-6 h-6 text-[11px]',
    md: 'w-7 h-7 text-xs',
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div
        className={`${sizeClasses} ${color.bg} rounded-full border flex items-center justify-center font-bold tracking-tight shadow-xs flex-shrink-0 select-none`}
        title={`Assigned to ${trimmed}`}
      >
        {initials}
      </div>
      {showName && (
        <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
          {trimmed}
        </span>
      )}
    </div>
  );
}

