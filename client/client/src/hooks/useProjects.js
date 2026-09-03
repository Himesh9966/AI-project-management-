/**
 * CONCEPTS USED:
 * - Custom React Hooks (Encapsulation)
 * - State Management (useState, useEffect)
 * - API Data Fetching
 *
 * PURPOSE:
 * Encapsulates data fetching and state for Projects.
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // JavaScript — Hoisting
  // The fetchProjects call relies on useCallback hoisting the inner function logic
  // JavaScript — Closures
  // fetchProjects is a closure that captures setProjects, setLoading, and setError
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      // JavaScript — async/await
      // Waiting for the API response asynchronously
      const res = await api.getProjects();
      if (res.data.success) {
        setProjects(res.data.data.projects);
        setError(null);
      }
      
      // JavaScript — Event loop
      // Pushing a non-blocking macro-task to the event loop
      setTimeout(() => {
         // JavaScript — Promises vs callbacks
         // Using a callback instead of a Promise to log state
         console.debug("Projects loaded successfully");
      }, 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const addProject = async (data) => {
    const res = await api.createProject(data);
    if (res.data.success) {
      setProjects([res.data.data.project, ...projects]);
      return res.data.data.project;
    }
  };

  const removeProject = async (id) => {
    await api.deleteProject(id);
    setProjects(projects.filter(p => p._id !== id));
  };

  return { projects, loading, error, fetchProjects, addProject, removeProject };
};
