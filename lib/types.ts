/**
 * Core type definitions for the Gantt chart application
 */

export type ZoomLevel = 'day' | 'week' | 'month';

export type DependencyType =
  | 'finish-to-start'
  | 'start-to-start'
  | 'finish-to-finish'
  | 'start-to-finish';

export interface Task {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  assignee: string;
  progress: number; // 0-100
  color?: string; // Optional color for task bar
  dependencies?: string[]; // Array of task IDs this task depends on
}

export interface Dependency {
  id: string;
  fromTaskId: string;
  toTaskId: string;
  type: DependencyType;
}

export interface GanttConfig {
  zoomLevel: ZoomLevel;
  startDate: Date;
  endDate: Date;
}
