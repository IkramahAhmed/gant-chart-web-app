/**
 * Agent utilities for automatic task conflict resolution
 * Detects overlapping tasks and resolves conflicts by pushing tasks forward
 */

import { Task } from '../types';
import { getDaysBetween } from './dateUtils';

/**
 * Check if two tasks overlap
 */
export function tasksOverlap(task1: Task, task2: Task): boolean {
  // Tasks overlap if:
  // - task1 starts before task2 ends AND task1 ends after task2 starts
  return task1.startDate < task2.endDate && task1.endDate > task2.startDate;
}

/**
 * Find all overlapping task pairs
 */
export function findOverlappingTasks(tasks: Task[]): Array<[Task, Task]> {
  const overlaps: Array<[Task, Task]> = [];

  for (let i = 0; i < tasks.length; i++) {
    for (let j = i + 1; j < tasks.length; j++) {
      if (tasksOverlap(tasks[i], tasks[j])) {
        overlaps.push([tasks[i], tasks[j]]);
      }
    }
  }

  return overlaps;
}

/**
 * Resolve conflicts by pushing tasks forward
 * Strategy: Sort tasks by start date, then push each task forward if it overlaps with previous tasks
 */
export function resolveTaskConflicts(tasks: Task[]): Task[] {
  // Create a copy to avoid mutating the original
  const resolvedTasks = tasks.map((task) => ({ ...task }));

  // Sort tasks by start date
  resolvedTasks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  // Process each task and push it forward if it overlaps with previous tasks
  for (let i = 1; i < resolvedTasks.length; i++) {
    const currentTask = resolvedTasks[i];
    let latestEndDate = resolvedTasks[i - 1].endDate;

    // Check all previous tasks to find the latest end date
    for (let j = 0; j < i; j++) {
      if (tasksOverlap(resolvedTasks[j], currentTask)) {
        if (resolvedTasks[j].endDate > latestEndDate) {
          latestEndDate = resolvedTasks[j].endDate;
        }
      }
    }

    // If current task overlaps, push it forward
    if (currentTask.startDate < latestEndDate) {
      const duration = getDaysBetween(
        currentTask.startDate,
        currentTask.endDate
      );
      const newStartDate = new Date(latestEndDate);
      newStartDate.setDate(newStartDate.getDate() + 1); // Start the day after the previous task ends
      const newEndDate = new Date(newStartDate);
      newEndDate.setDate(newEndDate.getDate() + duration);

      resolvedTasks[i] = {
        ...currentTask,
        startDate: newStartDate,
        endDate: newEndDate,
      };
    }
  }

  return resolvedTasks;
}

/**
 * Count number of conflicts in task list
 */
export function countConflicts(tasks: Task[]): number {
  return findOverlappingTasks(tasks).length;
}
