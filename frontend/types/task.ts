export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type SortOption = 'newest' | 'oldest' | 'priority_desc' | 'priority_asc' | 'title_asc' | 'title_desc';

export interface Task {
  id: string;
  _id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  dueDate?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus | string;
  priority?: TaskPriority | string;
  assignedTo?: string;
  dueDate?: string | null;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus | string;
  priority?: TaskPriority | string;
  assignedTo?: string;
  dueDate?: string | null;
}

export interface TaskQueryParams {
  status?: string;
  priority?: string;
  search?: string;
  assignedTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  completionPercentage: number;
}

export interface HistoryDay {
  date: string;
  year: number;
  month: number;
  day: number;
  count: number;
  done: number;
  inProgress: number;
  todo: number;
  tasks: Task[];
}

export interface HistoryMonth {
  year: number;
  month: number;
  count: number;
  label: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  total?: number;
  page?: number;
  totalPages?: number;
}

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'priority_desc', label: 'Priority (High → Low)' },
  { value: 'priority_asc', label: 'Priority (Low → High)' },
  { value: 'title_asc', label: 'Title (A → Z)' },
  { value: 'title_desc', label: 'Title (Z → A)' },
];
