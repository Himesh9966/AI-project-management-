/**
 * CONCEPTS USED:
 * - Axios HTTP Client & Interceptors
 * - LocalStorage state persistence
 * - Promises & Async/Await
 *
 * PURPOSE:
 * Centralizes all HTTP API communication with the Express backend.
 *
 * RESPONSIBILITY:
 * Automatically attaches JWT tokens to requests, handles response parsing,
 * and abstracts API URLs away from React components.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Project APIs
export const getProjects = () => api.get('/projects');
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const createProject = (data) => api.post('/projects', data);
export const updateProject = (id, data) => api.patch(`/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/projects/${id}`);

// Task APIs
export const getTasks = (projectId) => api.get(`/projects/${projectId}/tasks`);
export const createTask = (projectId, data) => api.post(`/projects/${projectId}/tasks`, data);
export const updateTask = (id, data) => api.patch(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// AI APIs
export const generateAIPlan = (projectIdea) => api.post('/ai/plan', { projectIdea });
export const getSavedAIPlans = () => api.get('/ai/plans');
export const askAIMentor = (projectId, message) => api.post('/ai/mentor', { projectId, message });
export const generateSubtasks = (taskId, taskDescription) => api.post('/ai/subtasks', { taskId, taskDescription });
export const modelProblem = (problemDescription) => api.post('/ai/model-problem', { problemDescription });

export default api;
