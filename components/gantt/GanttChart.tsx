'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task, Dependency } from '@/lib/types';
import { useTasks } from '@/hooks/useTasks';
import { useDependencies } from '@/hooks/useDependencies';
import { getChartDateRange } from '@/lib/utils/ganttUtils';
import { resolveTaskConflicts, countConflicts } from '@/lib/utils/agentUtils';
import { Timeline } from './Timeline';
import { TaskList } from './TaskList';
import { TaskBar } from './TaskBar';
import { DependencyArrow } from './DependencyArrow';
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
  const { dependencies, addDependency } = useDependencies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [conflictCount, setConflictCount] = useState(0);
  const [agentMessage, setAgentMessage] = useState<string | null>(null);

  const dateRange = useMemo(() => getChartDateRange(tasks), [tasks]);
  const zoomLevel: 'day' | 'week' | 'month' = 'day';

  // Update conflict count when tasks change
  useEffect(() => {
    const conflicts = countConflicts(tasks);
    setConflictCount(conflicts);
  }, [tasks]);

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

  const handleAgentResolve = () => {
    const conflictsBefore = countConflicts(tasks);
    if (conflictsBefore === 0) {
      setAgentMessage(
        'No conflicts detected. All tasks are properly scheduled!'
      );
      setTimeout(() => setAgentMessage(null), 3000);
      return;
    }

    // Resolve conflicts
    const resolvedTasks = resolveTaskConflicts(tasks);

    // Update all tasks
    resolvedTasks.forEach((resolvedTask) => {
      updateTask(resolvedTask.id, {
        startDate: resolvedTask.startDate,
        endDate: resolvedTask.endDate,
      });
    });

    const conflictsAfter = countConflicts(resolvedTasks);
    setAgentMessage(
      `Resolved ${conflictsBefore} conflict(s). ${conflictsAfter} remaining.`
    );
    setTimeout(() => setAgentMessage(null), 4000);
  };

  const handleAddDependency = (
    fromTaskId: string,
    toTaskId: string,
    type: string
  ) => {
    const dependency: Dependency = {
      id: `${fromTaskId}-${toTaskId}-${Date.now()}`,
      fromTaskId,
      toTaskId,
      type: type as Dependency['type'],
    };
    addDependency(dependency);
  };

  return (
    <DndProviderWrapper>
      <GanttChartContent
        tasks={tasks}
        dateRange={dateRange}
        zoomLevel={zoomLevel}
        isModalOpen={isModalOpen}
        editingTask={editingTask}
        conflictCount={conflictCount}
        agentMessage={agentMessage}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onCloseModal={handleCloseModal}
        onSaveTask={handleSaveTask}
        onDeleteTask={handleDeleteTask}
        onMoveTask={handleMoveTask}
        onResizeTask={handleResizeTask}
        onAgentResolve={handleAgentResolve}
        dependencies={dependencies}
        onAddDependency={handleAddDependency}
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
  conflictCount,
  agentMessage,
  onAddTask,
  onEditTask,
  onCloseModal,
  onSaveTask,
  onDeleteTask,
  onMoveTask,
  onResizeTask,
  onAgentResolve,
  dependencies,
  onAddDependency,
}: {
  tasks: Task[];
  dateRange: { start: Date; end: Date };
  zoomLevel: 'day' | 'week' | 'month';
  isModalOpen: boolean;
  editingTask: Task | null;
  conflictCount: number;
  agentMessage: string | null;
  onAddTask: () => void;
  onEditTask: (task: Task) => void;
  onCloseModal: () => void;
  onSaveTask: (taskData: Omit<Task, 'id'> & { id?: string }) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
  onResizeTask: (taskId: string, newStartDate: Date, newEndDate: Date) => void;
  onAgentResolve: () => void;
  dependencies: Dependency[];
  onAddDependency: (fromTaskId: string, toTaskId: string, type: string) => void;
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
            <div className={styles.headerActions}>
              <button
                className={`${styles.agentButton} ${
                  conflictCount > 0 ? styles.agentButtonWarning : ''
                }`}
                onClick={onAgentResolve}
                aria-label="Resolve task conflicts"
                type="button"
                title={
                  conflictCount > 0
                    ? `Resolve ${conflictCount} conflict(s)`
                    : 'No conflicts detected'
                }
              >
                🤖 Agent
                {conflictCount > 0 && (
                  <span className={styles.conflictBadge}>{conflictCount}</span>
                )}
              </button>
              <button
                className={styles.addButton}
                onClick={onAddTask}
                aria-label="Add new task"
                type="button"
              >
                + Add Task
              </button>
            </div>
          </div>
          {agentMessage && (
            <div
              className={`${styles.agentMessage} ${
                conflictCount === 0 ? styles.agentMessageSuccess : ''
              }`}
              role="alert"
            >
              {agentMessage}
            </div>
          )}
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
            {/* SVG layer for dependency arrows */}
            <svg
              className={styles.dependencyLayer}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            >
              {dependencies.map((dependency) => {
                const fromTask = tasks.find(
                  (t) => t.id === dependency.fromTaskId
                );
                const toTask = tasks.find((t) => t.id === dependency.toTaskId);
                if (!fromTask || !toTask) return null;

                const fromIndex = tasks.findIndex(
                  (t) => t.id === dependency.fromTaskId
                );
                const toIndex = tasks.findIndex(
                  (t) => t.id === dependency.toTaskId
                );

                return (
                  <DependencyArrow
                    key={dependency.id}
                    dependency={dependency}
                    fromTask={fromTask}
                    toTask={toTask}
                    chartStartDate={dateRange.start}
                    zoomLevel={zoomLevel}
                    fromTaskIndex={fromIndex}
                    toTaskIndex={toIndex}
                  />
                );
              })}
            </svg>

            {/* Task bars */}
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
        tasks={tasks}
        onClose={onCloseModal}
        onSave={onSaveTask}
        onDelete={onDeleteTask}
        onAddDependency={onAddDependency}
      />
    </div>
  );
}
