'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Task } from '@/lib/types';
import styles from './TaskModal.module.css';

interface TaskModalProps {
  isOpen: boolean;
  task?: Task | null;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
}

/**
 * Task Modal Component
 * Form for creating and editing tasks
 * Includes validation and accessibility features
 */
export function TaskModal({
  isOpen,
  task,
  onClose,
  onSave,
  onDelete,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assignee, setAssignee] = useState('');
  const [progress, setProgress] = useState(0);
  const [color, setColor] = useState('#3b82f6');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStartDate(formatDateForInput(task.startDate));
      setEndDate(formatDateForInput(task.endDate));
      setAssignee(task.assignee);
      setProgress(task.progress);
      setColor(task.color || '#3b82f6');
    } else {
      // Reset form for new task
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setTitle('');
      setStartDate(formatDateForInput(today));
      setEndDate(formatDateForInput(tomorrow));
      setAssignee('');
      setProgress(0);
      setColor('#3b82f6');
    }
    setErrors({});
  }, [task, isOpen]);

  // Format date for HTML date input
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Validate form
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    if (!assignee.trim()) {
      newErrors.assignee = 'Assignee is required';
    }

    if (progress < 0 || progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const taskData: Omit<Task, 'id'> & { id?: string } = {
      id: task?.id,
      title: title.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      assignee: assignee.trim(),
      progress: Math.round(progress),
      color,
    };

    onSave(taskData);
    onClose();
  };

  // Handle delete
  const handleDelete = () => {
    if (task?.id && onDelete) {
      if (
        window.confirm(
          `Are you sure you want to delete "${task.title}"? This action cannot be undone.`
        )
      ) {
        onDelete(task.id);
        onClose();
      }
    }
  };

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <div className={styles.modalHeader}>
          <h2 id="modal-title" className={styles.modalTitle}>
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="task-title" className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              placeholder="Enter task title"
              required
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && (
              <span
                id="title-error"
                className={styles.errorMessage}
                role="alert"
              >
                {errors.title}
              </span>
            )}
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="task-start-date" className={styles.label}>
                Start Date <span className={styles.required}>*</span>
              </label>
              <input
                id="task-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`${styles.input} ${errors.startDate ? styles.inputError : ''}`}
                required
                aria-invalid={!!errors.startDate}
                aria-describedby={
                  errors.startDate ? 'start-date-error' : undefined
                }
              />
              {errors.startDate && (
                <span
                  id="start-date-error"
                  className={styles.errorMessage}
                  role="alert"
                >
                  {errors.startDate}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="task-end-date" className={styles.label}>
                End Date <span className={styles.required}>*</span>
              </label>
              <input
                id="task-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={`${styles.input} ${errors.endDate ? styles.inputError : ''}`}
                required
                aria-invalid={!!errors.endDate}
                aria-describedby={errors.endDate ? 'end-date-error' : undefined}
              />
              {errors.endDate && (
                <span
                  id="end-date-error"
                  className={styles.errorMessage}
                  role="alert"
                >
                  {errors.endDate}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="task-assignee" className={styles.label}>
              Assignee <span className={styles.required}>*</span>
            </label>
            <input
              id="task-assignee"
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className={`${styles.input} ${errors.assignee ? styles.inputError : ''}`}
              placeholder="Enter assignee name"
              required
              aria-invalid={!!errors.assignee}
              aria-describedby={errors.assignee ? 'assignee-error' : undefined}
            />
            {errors.assignee && (
              <span
                id="assignee-error"
                className={styles.errorMessage}
                role="alert"
              >
                {errors.assignee}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="task-progress" className={styles.label}>
              Progress: {progress}%
            </label>
            <input
              id="task-progress"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className={styles.rangeInput}
              aria-label="Task progress percentage"
            />
            {errors.progress && (
              <span className={styles.errorMessage} role="alert">
                {errors.progress}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="task-color" className={styles.label}>
              Color
            </label>
            <div className={styles.colorInputWrapper}>
              <input
                id="task-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className={styles.colorInput}
                aria-label="Task color"
              />
              <span className={styles.colorValue}>{color}</span>
            </div>
          </div>

          <div className={styles.modalActions}>
            {task && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className={styles.deleteButton}
                aria-label={`Delete task ${task.title}`}
              >
                Delete
              </button>
            )}
            <div className={styles.actionButtons}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" className={styles.saveButton}>
                {task ? 'Update' : 'Create'} Task
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
