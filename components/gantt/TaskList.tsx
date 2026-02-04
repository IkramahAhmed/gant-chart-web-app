'use client';

import { Task } from '@/lib/types';
import { getGanttConstants } from '@/lib/utils/ganttUtils';
import styles from './TaskList.module.css';

interface TaskListProps {
  tasks: Task[];
}

/**
 * Task List component
 * Displays task names and assignees in the left sidebar
 */
export function TaskList({ tasks }: TaskListProps) {
  const { TASK_ROW_HEIGHT } = getGanttConstants();

  return (
    <div className={styles.taskList} role="list" aria-label="Task list">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className={styles.taskListItem}
          style={{ height: `${TASK_ROW_HEIGHT}px` }}
          role="listitem"
          aria-label={`Task: ${task.title}, Assignee: ${task.assignee}`}
        >
          <div className={styles.taskInfo}>
            <div
              className={styles.taskColorIndicator}
              style={{ backgroundColor: task.color || '#3b82f6' }}
              aria-hidden="true"
            />
            <div className={styles.taskDetails}>
              <div className={styles.taskTitle}>{task.title}</div>
              <div className={styles.taskAssignee}>{task.assignee}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
