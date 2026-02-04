'use client';

import { Task, ZoomLevel } from '@/lib/types';
import {
  getTaskBarLeft,
  getTaskBarWidth,
  getTaskRowTop,
  getGanttConstants,
} from '@/lib/utils/ganttUtils';
import {
  useTaskDrag,
  useTaskResizeLeft,
  useTaskResizeRight,
} from '@/hooks/useDragDrop';
import styles from './TaskBar.module.css';

interface TaskBarProps {
  task: Task;
  taskIndex: number;
  chartStartDate: Date;
  zoomLevel: ZoomLevel;
  onClick?: () => void;
  onMove: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
  onResize: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
}

/**
 * Task Bar component
 * Displays individual task as a bar on the timeline
 */
export function TaskBar({
  task,
  taskIndex,
  chartStartDate,
  zoomLevel,
  onClick,
  onMove,
  onResize,
}: TaskBarProps) {
  const { TASK_ROW_HEIGHT } = getGanttConstants();
  const left = getTaskBarLeft(task.startDate, chartStartDate, zoomLevel);
  const width = getTaskBarWidth(task.startDate, task.endDate, zoomLevel);
  const top = getTaskRowTop(taskIndex);

  // Drag hooks
  const { drag: dragMove, isDragging: isDraggingMove } = useTaskDrag({
    task,
    chartStartDate,
    zoomLevel,
    onMove,
  });

  const { drag: dragResizeLeft, isDragging: isDraggingLeft } =
    useTaskResizeLeft({
      task,
      chartStartDate,
      zoomLevel,
      onResize,
    });

  const { drag: dragResizeRight, isDragging: isDraggingRight } =
    useTaskResizeRight({
      task,
      chartStartDate,
      zoomLevel,
      onResize,
    });

  const isDragging = isDraggingMove || isDraggingLeft || isDraggingRight;

  return (
    <div
      className={`${styles.taskBarContainer} ${isDragging ? styles.dragging : ''}`}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${TASK_ROW_HEIGHT}px`,
      }}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      aria-label={`Task: ${task.title}, Progress: ${task.progress}%, From ${task.startDate.toLocaleDateString()} to ${task.endDate.toLocaleDateString()}`}
    >
      {/* Left resize handle */}
      <div
        ref={(node) => {
          if (node && dragResizeLeft) dragResizeLeft(node);
        }}
        className={`${styles.resizeHandle} ${styles.resizeHandleLeft}`}
        aria-label="Resize task start date"
        role="button"
        tabIndex={0}
      />

      {/* Main task bar (draggable for moving) */}
      <div
        ref={(node) => {
          if (node && dragMove) dragMove(node);
        }}
        className={styles.taskBar}
        style={{
          backgroundColor: task.color || '#3b82f6',
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <div className={styles.taskBarContent}>
          <span className={styles.taskBarTitle}>{task.title}</span>
          {task.progress > 0 && (
            <span className={styles.taskBarProgress}>{task.progress}%</span>
          )}
        </div>
        {/* Progress indicator overlay */}
        {task.progress > 0 && (
          <div
            className={styles.progressOverlay}
            style={{ width: `${task.progress}%` }}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Right resize handle */}
      <div
        ref={(node) => {
          if (node && dragResizeRight) dragResizeRight(node);
        }}
        className={`${styles.resizeHandle} ${styles.resizeHandleRight}`}
        aria-label="Resize task end date"
        role="button"
        tabIndex={0}
      />
    </div>
  );
}
