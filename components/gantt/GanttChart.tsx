'use client';

import { useMemo } from 'react';
import { taskStore } from '@/lib/store';
import { getChartDateRange } from '@/lib/utils/ganttUtils';
import { Timeline } from './Timeline';
import { TaskList } from './TaskList';
import { TaskBar } from './TaskBar';
import styles from './GanttChart.module.css';

/**
 * Main Gantt chart component
 * Displays tasks in a timeline view with task list sidebar
 */
export function GanttChart() {
  const tasks = taskStore.getTasks();
  const dateRange = useMemo(() => getChartDateRange(tasks), [tasks]);
  const zoomLevel: 'day' | 'week' | 'month' = 'day';

  return (
    <div className={styles.ganttContainer} role="main" aria-label="Gantt chart">
      <div className={styles.ganttGrid}>
        {/* Task List Sidebar */}
        <div className={styles.taskListContainer}>
          <div className={styles.taskListHeader}>
            <h2 className={styles.headerTitle}>Tasks</h2>
          </div>
          <TaskList tasks={tasks} />
        </div>

        {/* Timeline Area */}
        <div className={styles.timelineContainer}>
          <div className={styles.timelineHeader}>
            <Timeline
              startDate={dateRange.start}
              endDate={dateRange.end}
              zoomLevel={zoomLevel}
            />
          </div>
          <div className={styles.timelineContent}>
            {tasks.map((task, index) => (
              <TaskBar
                key={task.id}
                task={task}
                taskIndex={index}
                chartStartDate={dateRange.start}
                zoomLevel={zoomLevel}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
