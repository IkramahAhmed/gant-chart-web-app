/**
 * Dependency Arrow Component
 * Renders visual arrows between dependent tasks
 */

'use client';

import { Task, Dependency } from '@/lib/types';
import {
  getTaskBarLeft,
  getTaskBarWidth,
  getTaskRowTop,
  getGanttConstants,
} from '@/lib/utils/ganttUtils';
import styles from './DependencyArrow.module.css';

interface DependencyArrowProps {
  dependency: Dependency;
  fromTask: Task;
  toTask: Task;
  chartStartDate: Date;
  zoomLevel: 'day' | 'week' | 'month';
  fromTaskIndex: number;
  toTaskIndex: number;
}

export function DependencyArrow({
  dependency,
  fromTask,
  toTask,
  chartStartDate,
  zoomLevel,
  fromTaskIndex,
  toTaskIndex,
}: DependencyArrowProps) {
  const { TASK_ROW_HEIGHT } = getGanttConstants();

  // Calculate positions
  const fromLeft = getTaskBarLeft(
    fromTask.startDate,
    chartStartDate,
    zoomLevel
  );
  const fromWidth = getTaskBarWidth(
    fromTask.startDate,
    fromTask.endDate,
    zoomLevel
  );
  const fromTop = getTaskRowTop(fromTaskIndex);
  const fromCenterY = fromTop + TASK_ROW_HEIGHT / 2;

  const toLeft = getTaskBarLeft(toTask.startDate, chartStartDate, zoomLevel);
  const toWidth = getTaskBarWidth(toTask.startDate, toTask.endDate, zoomLevel);
  const toTop = getTaskRowTop(toTaskIndex);
  const toCenterY = toTop + TASK_ROW_HEIGHT / 2;

  // Determine connection points based on dependency type
  let startX = 0;
  let endX = 0;

  switch (dependency.type) {
    case 'finish-to-start':
      startX = fromLeft + fromWidth; // End of from task
      endX = toLeft; // Start of to task
      break;
    case 'start-to-start':
      startX = fromLeft; // Start of from task
      endX = toLeft; // Start of to task
      break;
    case 'finish-to-finish':
      startX = fromLeft + fromWidth; // End of from task
      endX = toLeft + toWidth; // End of to task
      break;
    case 'start-to-finish':
      startX = fromLeft; // Start of from task
      endX = toLeft + toWidth; // End of to task
      break;
  }

  // Calculate arrow path
  const midY = (fromCenterY + toCenterY) / 2;
  const controlPoint1Y = fromCenterY + (toCenterY - fromCenterY) * 0.3;
  const controlPoint2Y = toCenterY - (toCenterY - fromCenterY) * 0.3;

  // Arrow head size
  const arrowSize = 8;
  const arrowAngle = Math.atan2(toCenterY - fromCenterY, endX - startX);

  return (
    <g className={styles.dependencyArrow}>
      {/* Curved path */}
      <path
        d={`M ${startX} ${fromCenterY} C ${startX} ${controlPoint1Y}, ${endX} ${controlPoint2Y}, ${endX} ${toCenterY}`}
        fill="none"
        stroke="#8b5cf6"
        strokeWidth="2"
        strokeDasharray="5,5"
        markerEnd="url(#arrowhead)"
        className={styles.arrowPath}
      />
      {/* Arrow head marker */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3, 0 6"
            fill="#8b5cf6"
            className={styles.arrowHead}
          />
        </marker>
      </defs>
    </g>
  );
}
