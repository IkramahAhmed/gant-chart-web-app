/**
 * Custom hook for drag and drop functionality
 * Handles moving and resizing tasks on the Gantt chart
 */

import { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Task, ZoomLevel } from '@/lib/types';
import { pixelToDate, getPixelsPerDay } from '@/lib/utils/ganttUtils';
import { getDaysBetween } from '@/lib/utils/dateUtils';

interface DragItem {
  type: string;
  task: Task;
  dragType: 'move' | 'resize-left' | 'resize-right';
}

interface UseDragDropProps {
  task: Task;
  chartStartDate: Date;
  zoomLevel: ZoomLevel;
  onMove: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
  onResize: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
}

interface UseResizeProps {
  task: Task;
  chartStartDate: Date;
  zoomLevel: ZoomLevel;
  onResize: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
}

/**
 * Hook for dragging tasks (moving)
 */
export function useTaskDrag({
  task,
  chartStartDate,
  zoomLevel,
  onMove,
}: Omit<UseDragDropProps, 'onResize'>) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'task',
      item: { type: 'task', task, dragType: 'move' as const },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item: DragItem, monitor) => {
        if (!monitor.didDrop()) {
          return;
        }

        const dropResult = monitor.getDropResult() as {
          x: number;
          y: number;
        } | null;

        if (dropResult) {
          const newStartDate = pixelToDate(
            dropResult.x,
            chartStartDate,
            zoomLevel
          );
          const duration = getDaysBetween(task.startDate, task.endDate);
          const newEndDate = new Date(newStartDate);
          newEndDate.setDate(newEndDate.getDate() + duration);

          onMove(task.id, newStartDate, newEndDate);
        }
      },
    }),
    [task, chartStartDate, zoomLevel, onMove]
  );

  return { drag, isDragging };
}

/**
 * Hook for resizing tasks from left edge
 */
export function useTaskResizeLeft({
  task,
  chartStartDate,
  zoomLevel,
  onResize,
}: UseResizeProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'resize-left',
      item: { type: 'resize-left', task, dragType: 'resize-left' as const },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item: DragItem, monitor) => {
        if (!monitor.didDrop()) {
          return;
        }

        const dropResult = monitor.getDropResult() as {
          x: number;
        } | null;

        if (dropResult) {
          const newStartDate = pixelToDate(
            dropResult.x,
            chartStartDate,
            zoomLevel
          );

          // Ensure new start date is before end date
          if (newStartDate < task.endDate) {
            onResize(task.id, newStartDate, task.endDate);
          }
        }
      },
    }),
    [task, chartStartDate, zoomLevel, onResize]
  );

  return { drag, isDragging };
}

/**
 * Hook for resizing tasks from right edge
 */
export function useTaskResizeRight({
  task,
  chartStartDate,
  zoomLevel,
  onResize,
}: UseResizeProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'resize-right',
      item: { type: 'resize-right', task, dragType: 'resize-right' as const },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item: DragItem, monitor) => {
        if (!monitor.didDrop()) {
          return;
        }

        const dropResult = monitor.getDropResult() as {
          x: number;
        } | null;

        if (dropResult) {
          const newEndDate = pixelToDate(
            dropResult.x,
            chartStartDate,
            zoomLevel
          );

          // Ensure new end date is after start date
          if (newEndDate > task.startDate) {
            onResize(task.id, task.startDate, newEndDate);
          }
        }
      },
    }),
    [task, chartStartDate, zoomLevel, onResize]
  );

  return { drag, isDragging };
}

/**
 * Hook for drop zone (timeline area)
 */
export function useTimelineDrop() {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: ['task', 'resize-left', 'resize-right'],
      drop: (item: DragItem, monitor) => {
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) {
          return null;
        }

        // Get the timeline container element
        const timelineElement = document.querySelector(
          '[data-timeline-container]'
        );
        if (!timelineElement) {
          return null;
        }

        const rect = timelineElement.getBoundingClientRect();
        const x = clientOffset.x - rect.left;

        return { x, y: clientOffset.y - rect.top };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    []
  );

  return { drop, isOver };
}
