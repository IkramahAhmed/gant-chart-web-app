'use client';

import { useMemo, useState } from 'react';
import { Task } from '@/lib/types';
import { useTasks } from '@/hooks/useTasks';
import { getChartDateRange } from '@/lib/utils/ganttUtils';
import { Timeline } from './Timeline';
import { TaskList } from './TaskList';
import { TaskBar } from './TaskBar';
import { TaskModal } from '@/components/modals/TaskModal';
import styles from './GanttChart.module.css';

/**
 * Main Gantt chart component
 * Displays tasks in a timeline view with task list sidebar
 */
export function GanttChart() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const dateRange = useMemo(() => getChartDateRange(tasks), [tasks]);
  const zoomLevel: 'day' | 'week' | 'month' = 'day';

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id'> & { id?: string }) => {
    if (taskData.id) {
      // Update existing task
      updateTask(taskData.id, taskData);
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(), // Simple ID generation
      };
      addTask(newTask);
    }
  };

  const handleDeleteTask = (id: string) => {
    deleteTask(id);
  };

  return (
    <div className={styles.ganttContainer} role="main" aria-label="Gantt chart">
      <div className={styles.ganttGrid}>
        {/* Task List Sidebar */}
        <div className={styles.taskListContainer}>
          <div className={styles.taskListHeader}>
            <h2 className={styles.headerTitle}>Tasks</h2>
            <button
              className={styles.addButton}
              onClick={handleAddTask}
              aria-label="Add new task"
              type="button"
            >
              + Add Task
            </button>
          </div>
          <TaskList tasks={tasks} onTaskClick={handleEditTask} />
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
                onClick={() => handleEditTask(task)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}
