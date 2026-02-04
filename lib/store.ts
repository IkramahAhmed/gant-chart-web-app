/**
 * In-memory task store
 * Designed to be easily replaced with API calls later
 */

import { Task, Dependency } from './types';

// In-memory storage
let tasks: Task[] = [];
let dependencies: Dependency[] = [];

// Sample data for Phase 1
const generateSampleTasks = (): Task[] => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const twoWeeks = new Date(today);
  twoWeeks.setDate(twoWeeks.getDate() + 14);

  return [
    {
      id: '1',
      title: 'Project Planning',
      startDate: today,
      endDate: tomorrow,
      assignee: 'Alice',
      progress: 50,
      color: '#3b82f6',
    },
    {
      id: '2',
      title: 'Design System',
      startDate: tomorrow,
      endDate: nextWeek,
      assignee: 'Bob',
      progress: 25,
      color: '#10b981',
    },
    {
      id: '3',
      title: 'Development',
      startDate: nextWeek,
      endDate: twoWeeks,
      assignee: 'Charlie',
      progress: 0,
      color: '#f59e0b',
    },
    {
      id: '4',
      title: 'Testing',
      startDate: twoWeeks,
      endDate: new Date(twoWeeks.getTime() + 3 * 24 * 60 * 60 * 1000),
      assignee: 'Diana',
      progress: 0,
      color: '#ef4444',
    },
  ];
};

// Initialize with sample data
tasks = generateSampleTasks();

/**
 * Task operations
 */
export const taskStore = {
  getTasks: (): Task[] => {
    return [...tasks];
  },

  getTask: (id: string): Task | undefined => {
    return tasks.find((task) => task.id === id);
  },

  addTask: (task: Task): void => {
    tasks.push(task);
  },

  updateTask: (id: string, updates: Partial<Task>): void => {
    const index = tasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
    }
  },

  deleteTask: (id: string): void => {
    tasks = tasks.filter((task) => task.id !== id);
    // Also remove dependencies related to this task
    dependencies = dependencies.filter(
      (dep) => dep.fromTaskId !== id && dep.toTaskId !== id
    );
  },
};

/**
 * Dependency operations
 */
export const dependencyStore = {
  getDependencies: (): Dependency[] => {
    return [...dependencies];
  },

  addDependency: (dependency: Dependency): void => {
    dependencies.push(dependency);
  },

  removeDependency: (id: string): void => {
    dependencies = dependencies.filter((dep) => dep.id !== id);
  },

  getDependenciesForTask: (taskId: string): Dependency[] => {
    return dependencies.filter((dep) => dep.toTaskId === taskId);
  },
};
