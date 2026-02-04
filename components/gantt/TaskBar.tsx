'use client';

import { Task, ZoomLevel } from '@/lib/types';
import {
  getTaskBarLeft,
  getTaskBarWidth,
  getTaskRowTop,
  getGanttConstants,
} from '@/lib/utils/ganttUtils';
import styles from './TaskBar.module.css';

interface TaskBarProps {
  task: Task;
  taskIndex: number;
  chartStartDate: Date;
  zoomLevel: ZoomLevel;
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
}: TaskBarProps) {
  const { TASK_ROW_HEIGHT } = getGanttConstants();
  const left = getTaskBarLeft(task.startDate, chartStartDate, zoomLevel);
  const width = getTaskBarWidth(task.startDate, task.endDate, zoomLevel);
  const top = getTaskRowTop(taskIndex);

  return (
    <div
      className={styles.taskBarContainer}
      style={{
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`,
        height: `${TASK_ROW_HEIGHT - 8}px`,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Task: ${task.title}, Progress: ${task.progress}%, From ${task.startDate.toLocaleDateString()} to ${task.endDate.toLocaleDateString()}`}
    >
      <div
        className={styles.taskBar}
        style={{
          backgroundColor: task.color || '#3b82f6',
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
    </div>
  );
}
