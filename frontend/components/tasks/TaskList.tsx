'use client';

import React from 'react';
import { Task, TaskStatus } from '../../types/task';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => Promise<void>;
  onEditRequest: (task: Task) => void;
  onDeleteRequest: (task: Task) => void;
  onOpenDetails?: (task: Task) => void;
}

export default function TaskList({
  tasks,
  onStatusChange,
  onEditRequest,
  onDeleteRequest,
  onOpenDetails,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id || task._id}
          task={task}
          onStatusChange={onStatusChange}
          onEditRequest={onEditRequest}
          onDeleteRequest={onDeleteRequest}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  );
}
