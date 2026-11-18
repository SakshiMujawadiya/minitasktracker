'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from '../services/taskService';
import {
  Task,
  TaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
  SortOption,
  STATUS_LABELS,
} from '../types/task';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/dashboard/Header';
import SummaryCards from '../components/dashboard/SummaryCards';
import TaskFilterBar from '../components/tasks/TaskFilterBar';
import TaskList from '../components/tasks/TaskList';
import TaskBoard from '../components/tasks/TaskBoard';
import TaskModal from '../components/tasks/TaskModal';
import EditTaskModal from '../components/tasks/EditTaskModal';
import DeleteModal from '../components/tasks/DeleteModal';
import TaskDetailDrawer from '../components/tasks/TaskDetailDrawer';
import CommandPalette from '../components/common/CommandPalette';
import Toast from '../components/common/Toast';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import TaskHistory from '../components/tasks/TaskHistory';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allTasksForStats, setAllTasksForStats] = useState<Task[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [currentPriority, setCurrentPriority] = useState<string>('all');
  const [currentSort, setCurrentSort] = useState<SortOption>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & Panels state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [initialNewTaskStatus, setInitialNewTaskStatus] = useState<TaskStatus>('todo');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskForDetailDrawer, setTaskForDetailDrawer] = useState<Task | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Mobile sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Toast notification state
  const [toast, setToast] = useState<{
    message: string;
    type?: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // Listen for custom event from hotkey
  useEffect(() => {
    const handleOpenPalette = () => setIsCommandPaletteOpen(true);
    window.addEventListener('open-command-palette', handleOpenPalette);
    return () => window.removeEventListener('open-command-palette', handleOpenPalette);
  }, []);

  // Fetch tasks from Express REST API
  const loadTasks = useCallback(async (statusFilter: string) => {
    // History view is handled by TaskHistory component directly
    if (statusFilter === 'history') return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTasks(statusFilter);
      setTasks(data);

      if (statusFilter === 'all') {
        setAllTasksForStats(data);
      } else {
        getTasks('all')
          .then((all) => setAllTasksForStats(all))
          .catch(() => {});
      }
    } catch (err: any) {
      setError(err.message || 'Unable to connect to the backend server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks(currentStatus);
  }, [currentStatus, loadTasks]);

  // Handle Create Task
  const handleCreateTask = async (input: CreateTaskInput) => {
    const createdTask = await createTask(input);

    if (currentStatus === 'all' || currentStatus === createdTask.status) {
      setTasks((prev) => [createdTask, ...prev]);
    }
    setAllTasksForStats((prev) => [createdTask, ...prev]);

    showToast(`Task "${createdTask.title}" created successfully.`);
  };

  // Handle Edit Task (Partial update: title, description, status, priority)
  const handleUpdateTask = async (id: string, input: UpdateTaskInput) => {
    const updated = await updateTask(id, input);

    // Update in visible list
    setTasks((prev) => {
      if (currentStatus !== 'all' && currentStatus !== updated.status) {
        return prev.filter((t) => (t.id || t._id) !== id);
      }
      return prev.map((t) => ((t.id || t._id) === id ? updated : t));
    });

    // Update in overall stats list
    setAllTasksForStats((prev) =>
      prev.map((t) => ((t.id || t._id) === id ? updated : t))
    );

    // Update in detail drawer if active
    if (taskForDetailDrawer && (taskForDetailDrawer.id || taskForDetailDrawer._id) === id) {
      setTaskForDetailDrawer(updated);
    }

    showToast(`Task "${updated.title}" updated successfully.`);
  };

  // Handle Quick Status Change
  const handleStatusChange = async (id: string, newStatus: TaskStatus) => {
    try {
      const updated = await updateTaskStatus(id, newStatus);

      setTasks((prev) => {
        if (currentStatus !== 'all' && currentStatus !== newStatus) {
          return prev.filter((t) => (t.id || t._id) !== id);
        }
        return prev.map((t) => ((t.id || t._id) === id ? updated : t));
      });

      setAllTasksForStats((prev) =>
        prev.map((t) => ((t.id || t._id) === id ? updated : t))
      );

      if (taskForDetailDrawer && (taskForDetailDrawer.id || taskForDetailDrawer._id) === id) {
        setTaskForDetailDrawer(updated);
      }

      showToast(`Status updated to ${STATUS_LABELS[newStatus] || newStatus}.`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update task status.', 'error');
    }
  };

  // Handle Delete Task confirmed
  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);

    setTasks((prev) => prev.filter((t) => (t.id || t._id) !== id));
    setAllTasksForStats((prev) => prev.filter((t) => (t.id || t._id) !== id));

    if (taskForDetailDrawer && (taskForDetailDrawer.id || taskForDetailDrawer._id) === id) {
      setTaskForDetailDrawer(null);
    }

    showToast('Task deleted successfully.');
  };

  // Clear all filters
  const handleResetFilters = () => {
    setCurrentStatus('all');
    setCurrentPriority('all');
    setSearchQuery('');
    setCurrentSort('newest');
  };

  // Export tasks as CSV
  const handleExportCSV = () => {
    const exportData = allTasksForStats.length > 0 ? allTasksForStats : tasks;
    if (exportData.length === 0) {
      showToast('No tasks available to export.', 'error');
      return;
    }

    const headers = ['ID', 'Title', 'Description', 'Status', 'Priority', 'CreatedAt'];
    const rows = exportData.map((t) => [
      `"${t.id || t._id}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      `"${t.status}"`,
      `"${t.priority}"`,
      `"${t.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Tasks exported to CSV successfully.');
  };

  // Export tasks as JSON
  const handleExportJSON = () => {
    const exportData = allTasksForStats.length > 0 ? allTasksForStats : tasks;
    if (exportData.length === 0) {
      showToast('No tasks available to export.', 'error');
      return;
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Tasks exported to JSON successfully.');
  };

  // Real database-driven stats calculation
  const statsSource = allTasksForStats.length > 0 ? allTasksForStats : tasks;
  const counts = useMemo(() => {
    return {
      total: statsSource.length,
      todo: statsSource.filter((t) => t.status === 'todo').length,
      inProgress: statsSource.filter((t) => t.status === 'in_progress').length,
      done: statsSource.filter((t) => t.status === 'done').length,
    };
  }, [statsSource]);

  // Combined Multi-Filter & Sorting pipeline
  const filteredAndSortedTasks = useMemo(() => {
    // 1. Filter by Search Query
    let result = tasks.filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      );
    });

    // 2. Filter by Priority
    if (currentPriority !== 'all') {
      result = result.filter((t) => t.priority === currentPriority);
    }

    // 3. Sort tasks
    const priorityWeight: Record<string, number> = { high: 3, medium: 2, low: 1 };

    return [...result].sort((a, b) => {
      switch (currentSort) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority_desc':
          return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
        case 'priority_asc':
          return (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
        case 'title_asc':
          return a.title.localeCompare(b.title);
        case 'title_desc':
          return b.title.localeCompare(a.title);
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [tasks, searchQuery, currentPriority, currentSort]);

  const hasAnyTasks = counts.total > 0;
  const isFiltered =
    (currentStatus !== 'all' && currentStatus !== 'history') ||
    currentPriority !== 'all' ||
    searchQuery.trim().length > 0 ||
    currentSort !== 'newest';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <Sidebar
        currentFilter={currentStatus}
        onSelectFilter={(filter) => {
          setCurrentStatus(filter);
        }}
        counts={counts}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-7 lg:p-9 max-w-6xl mx-auto w-full transition-all duration-300">
        {/* Header */}
        <Header
          onAddNewTask={() => {
            setInitialNewTaskStatus('todo');
            setIsAddModalOpen(true);
          }}
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          totalTasks={counts.total}
          completedTasks={counts.done}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebarCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* History View */}
        {currentStatus === 'history' ? (
          <div className="mt-8 sm:mt-10">
            <TaskHistory />
          </div>
        ) : (
          <>
            {/* Dynamic Metric Cards */}
            <div className="mt-6 sm:mt-8">
              <SummaryCards
                total={counts.total}
                todo={counts.todo}
                inProgress={counts.inProgress}
                completed={counts.done}
                activeFilter={currentStatus}
                onFilterClick={(filter) => setCurrentStatus(filter)}
              />
            </div>

            {/* Task Management Section */}
            <div className="mt-8 sm:mt-10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Tasks Overview
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Showing {filteredAndSortedTasks.length}{' '}
                    {filteredAndSortedTasks.length === 1 ? 'task' : 'tasks'}
                  </p>
                </div>
              </div>

              {/* Filter Toolbar */}
              <TaskFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                currentStatus={currentStatus}
                onStatusChange={setCurrentStatus}
                currentPriority={currentPriority}
                onPriorityChange={setCurrentPriority}
                currentSort={currentSort}
                onSortChange={setCurrentSort}
                totalFilteredCount={filteredAndSortedTasks.length}
                onResetFilters={handleResetFilters}
                isFiltered={isFiltered}
              />

              {/* Content Views */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : error ? (
                <ErrorState
                  message={error}
                  onRetry={() => loadTasks(currentStatus)}
                />
              ) : filteredAndSortedTasks.length === 0 ? (
                <EmptyState
                  isFiltered={hasAnyTasks && isFiltered}
                  onActionClick={() => {
                    if (hasAnyTasks && isFiltered) {
                      handleResetFilters();
                    } else {
                      setInitialNewTaskStatus('todo');
                      setIsAddModalOpen(true);
                    }
                  }}
                />
              ) : viewMode === 'board' ? (
                <TaskBoard
                  tasks={filteredAndSortedTasks}
                  onStatusChange={handleStatusChange}
                  onEditRequest={(task) => setTaskToEdit(task)}
                  onDeleteRequest={(task) => setTaskToDelete(task)}
                  onOpenDetails={(task) => setTaskForDetailDrawer(task)}
                  onAddNewTaskWithStatus={(status) => {
                    setInitialNewTaskStatus(status);
                    setIsAddModalOpen(true);
                  }}
                />
              ) : (
                <TaskList
                  tasks={filteredAndSortedTasks}
                  onStatusChange={handleStatusChange}
                  onEditRequest={(task) => setTaskToEdit(task)}
                  onDeleteRequest={(task) => setTaskToDelete(task)}
                  onOpenDetails={(task) => setTaskForDetailDrawer(task)}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Add Task Modal */}
      <TaskModal
        isOpen={isAddModalOpen}
        initialStatus={initialNewTaskStatus}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateTask}
      />

      {/* Edit Task Modal */}
      <EditTaskModal
        task={taskToEdit}
        isOpen={Boolean(taskToEdit)}
        onClose={() => setTaskToEdit(null)}
        onSubmit={handleUpdateTask}
      />

      {/* Task Details Side Drawer */}
      <TaskDetailDrawer
        task={taskForDetailDrawer}
        isOpen={Boolean(taskForDetailDrawer)}
        onClose={() => setTaskForDetailDrawer(null)}
        onEditRequest={(task) => setTaskToEdit(task)}
        onDeleteRequest={(task) => setTaskToDelete(task)}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        task={taskToDelete}
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteTask}
      />

      {/* Command Palette Spotlight (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        tasks={allTasksForStats.length > 0 ? allTasksForStats : tasks}
        onSelectTask={(task) => setTaskForDetailDrawer(task)}
        onAddNewTask={() => {
          setInitialNewTaskStatus('todo');
          setIsAddModalOpen(true);
        }}
        onSelectFilter={setCurrentStatus}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onExportCSV={handleExportCSV}
        onExportJSON={handleExportJSON}
        onResetFilters={handleResetFilters}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
