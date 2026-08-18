/**
 * CONCEPTS USED:
 * - Custom React Hooks
 * - Data Fetching & Caching strategy
 *
 * PURPOSE:
 * Encapsulates data fetching and state for Tasks related to a specific project.
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await api.getTasks(projectId);
      if (res.data.success) {
        setTasks(res.data.data.tasks);
        setError(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (data) => {
    const res = await api.createTask(projectId, data);
    if (res.data.success) {
      setTasks([res.data.data.task, ...tasks]);
      return res.data.data.task;
    }
  };

  const updateTaskStatus = async (id, status) => {
    const res = await api.updateTask(id, { status });
    if (res.data.success) {
      setTasks(tasks.map(t => t._id === id ? res.data.data.task : t));
    }
  };

  const removeTask = async (id) => {
    await api.deleteTask(id);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return { tasks, loading, error, fetchTasks, addTask, updateTaskStatus, removeTask };
};
