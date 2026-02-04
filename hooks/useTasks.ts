/**
 * Custom hook for task management
 * Provides reactive state management for tasks
 */

import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/lib/types';
import { taskStore } from '@/lib/store';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(taskStore.getTasks());

  // Refresh tasks from store
  const refreshTasks = useCallback(() => {
    setTasks(taskStore.getTasks());
  }, []);

  // Add a new task
  const addTask = useCallback(
    (task: Task) => {
      taskStore.addTask(task);
      refreshTasks();
    },
    [refreshTasks]
  );

  // Update an existing task
  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      taskStore.updateTask(id, updates);
      refreshTasks();
    },
    [refreshTasks]
  );

  // Delete a task
  const deleteTask = useCallback(
    (id: string) => {
      taskStore.deleteTask(id);
      refreshTasks();
    },
    [refreshTasks]
  );

  // Get a single task
  const getTask = useCallback((id: string): Task | undefined => {
    return taskStore.getTask(id);
  }, []);

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTask,
    refreshTasks,
  };
}
