'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task } from '@/lib/types';
import { useTasks } from '@/hooks/useTasks';
import { getChartDateRange } from '@/lib/utils/ganttUtils';
import { Timeline } from './Timeline';
import { TaskList } from './TaskList';
import { TaskBar } from './TaskBar';
import { TaskModal } from '@/components/modals/TaskModal';
import { useTimelineDrop } from '@/hooks/useDragDrop';
import styles from './GanttChart.module.css';

/**
 * Client-side wrapper for DndProvider
 * Prevents SSR issues with react-dnd
 */
function DndProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
        }}
      >
        <div style={{ fontSize: '16px', color: '#64748b' }}>Loading...</div>
      </div>
    );
  }

  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>;
}

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

  const handleMoveTask = (
    taskId: string,
    newStartDate: Date,
    newEndDate: Date
  ) => {
    updateTask(taskId, {
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };

  const handleResizeTask = (
    taskId: string,
    newStartDate: Date,
    newEndDate: Date
  ) => {
    updateTask(taskId, {
      startDate: newStartDate,
      endDate: newEndDate,
    });
  };

  return (
    <DndProviderWrapper>
      <GanttChartContent
        tasks={tasks}
        dateRange={dateRange}
        zoomLevel={zoomLevel}
        isModalOpen={isModalOpen}
        editingTask={editingTask}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onCloseModal={handleCloseModal}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
        onMoveTask={handleMoveTask}
        onResizeTask={handleResizeTask}
      />
    </DndProviderWrapper>
  );
}

/**
 * Inner content component that uses DnD hooks
 * Must be inside DndProvider
 */
function GanttChartContent({
  tasks,
  dateRange,
  zoomLevel,
  isModalOpen,
  editingTask,
  onAddTask,
  onEditTask,
  onCloseModal,
  onSaveTask,
  onDeleteTask,
  onMoveTask,
  onResizeTask,
}: {
  tasks: Task[];
  dateRange: { start: Date; end: Date };
  zoomLevel: 'day' | 'week' | 'month';
  isModalOpen: boolean;
  editingTask: Task | null;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onCloseModal: () => void;
  onSaveTask: (taskData: Omit<Task, 'id'> & { id?: string }) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
  onResizeTask: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
}) {
  const { drop: timelineDrop } = useTimelineDrop();
  const timelineRef = useRef<HTMLDivElement>(null);

  // Combine refs
  useEffect(() => {
    if (timelineRef.current && timelineDrop) {
      timelineDrop(timelineRef.current);
    }
  }, [timelineDrop]);

  return (
    <div className={styles.ganttContainer} role="main" aria-label="Gantt chart">
      <div className={styles.ganttGrid}>
        {/* Task List Sidebar */}
        <div className={styles.taskListContainer}>
          <div className={styles.taskListHeader}>
            <h2 className={styles.headerTitle}>Tasks</h2>
            <button
              className={styles.addButton}
              onClick={onAddTask}
              aria-label="Add new task"
              type="button"
            >
              + Add Task
            </button>
          </div>
          <TaskList tasks={tasks} onTaskClick={onEditTask} />
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
          <div
            className={styles.timelineContent}
            ref={timelineRef}
            data-timeline-container
          >
            {tasks.map((task, index) => (
              <TaskBar
                key={task.id}
                task={task}
                taskIndex={index}
                chartStartDate={dateRange.start}
                zoomLevel={zoomLevel}
                onClick={() => onEditTask(task)}
                onMove={onMoveTask}
                onResize={onResizeTask}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        task={editingTask}
        onClose={onCloseModal}
        onSave={onSaveTask}
        onDelete={onDeleteTask}
      />
    </div>
  );
}
