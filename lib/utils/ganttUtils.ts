/**
 * Gantt chart positioning and calculation utilities
 */

import { Task, ZoomLevel } from '../types';
import { getDaysBetween, getStartOfDay } from './dateUtils';

// Constants
const PIXELS_PER_DAY = 40; // Base pixels per day for day view
const TASK_ROW_HEIGHT = 40; // Height of each task row
const TIMELINE_HEADER_HEIGHT = 60; // Height of timeline header

/**
 * Calculate pixels per day based on zoom level
 */
export const getPixelsPerDay = (zoomLevel: ZoomLevel): number => {
  switch (zoomLevel) {
    case 'day':
      return PIXELS_PER_DAY;
    case 'week':
      return PIXELS_PER_DAY / 7;
    case 'month':
      return PIXELS_PER_DAY / 30;
    default:
      return PIXELS_PER_DAY;
  }
};

/**
 * Calculate task bar position (left offset in pixels)
 */
export const getTaskBarLeft = (
  taskStartDate: Date,
  chartStartDate: Date,
  zoomLevel: ZoomLevel
): number => {
  const normalizedTaskStart = getStartOfDay(taskStartDate);
  const normalizedChartStart = getStartOfDay(chartStartDate);
  const daysOffset = getDaysBetween(normalizedChartStart, normalizedTaskStart);
  const pixelsPerDay = getPixelsPerDay(zoomLevel);
  return daysOffset * pixelsPerDay;
};

/**
 * Calculate task bar width in pixels
 */
export const getTaskBarWidth = (
  startDate: Date,
  endDate: Date,
  zoomLevel: ZoomLevel
): number => {
  const days = getDaysBetween(startDate, endDate) + 1; // +1 to include both start and end day
  const pixelsPerDay = getPixelsPerDay(zoomLevel);
  return days * pixelsPerDay;
};

/**
 * Calculate task row top position
 */
export const getTaskRowTop = (taskIndex: number): number => {
  return taskIndex * TASK_ROW_HEIGHT;
};

/**
 * Convert pixel position to date
 */
export const pixelToDate = (
  pixels: number,
  chartStartDate: Date,
  zoomLevel: ZoomLevel
): Date => {
  const pixelsPerDay = getPixelsPerDay(zoomLevel);
  const days = Math.round(pixels / pixelsPerDay);
  const date = new Date(chartStartDate);
  date.setDate(date.getDate() + days);
  return getStartOfDay(date);
};

/**
 * Get chart date range from tasks
 */
export const getChartDateRange = (
  tasks: Task[]
): { start: Date; end: Date } => {
  if (tasks.length === 0) {
    const today = new Date();
    return {
      start: today,
      end: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days default
    };
  }

  const dates = tasks.flatMap((task) => [task.startDate, task.endDate]);
  const start = new Date(Math.min(...dates.map((d) => d.getTime())));
  const end = new Date(Math.max(...dates.map((d) => d.getTime())));

  // Add padding (7 days before and after)
  start.setDate(start.getDate() - 7);
  end.setDate(end.getDate() + 7);

  return { start, end };
};

/**
 * Get constants
 */
export const getGanttConstants = () => ({
  TASK_ROW_HEIGHT,
  TIMELINE_HEADER_HEIGHT,
  PIXELS_PER_DAY,
});
