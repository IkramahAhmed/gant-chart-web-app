/**
 * Date utility functions for Gantt chart calculations
 */

import {
  format,
  startOfDay,
  endOfDay,
  addDays,
  addWeeks,
  addMonths,
  differenceInDays,
  isSameDay,
  isWithinInterval,
} from 'date-fns';
import { ZoomLevel } from '../types';

/**
 * Format date for display
 */
export const formatDate = (
  date: Date,
  formatStr: string = 'MMM dd, yyyy'
): string => {
  return format(date, formatStr);
};

/**
 * Get start of day (normalize time to 00:00:00)
 */
export const getStartOfDay = (date: Date): Date => {
  return startOfDay(date);
};

/**
 * Get end of day (normalize time to 23:59:59)
 */
export const getEndOfDay = (date: Date): Date => {
  return endOfDay(date);
};

/**
 * Calculate number of days between two dates
 */
export const getDaysBetween = (start: Date, end: Date): number => {
  return differenceInDays(end, start);
};

/**
 * Check if date is within range
 */
export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return isWithinInterval(date, { start, end });
};

/**
 * Get date range for zoom level
 */
export const getDateRange = (
  startDate: Date,
  endDate: Date,
  zoomLevel: ZoomLevel
): Date[] => {
  const dates: Date[] = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));

    switch (zoomLevel) {
      case 'day':
        current = addDays(current, 1);
        break;
      case 'week':
        current = addWeeks(current, 1);
        break;
      case 'month':
        current = addMonths(current, 1);
        break;
    }
  }

  return dates;
};

/**
 * Get format string for zoom level
 */
export const getDateFormat = (zoomLevel: ZoomLevel): string => {
  switch (zoomLevel) {
    case 'day':
      return 'MMM dd';
    case 'week':
      return 'MMM dd';
    case 'month':
      return 'MMM yyyy';
    default:
      return 'MMM dd, yyyy';
  }
};

/**
 * Check if two dates are the same day
 */
export const isSameDate = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};
