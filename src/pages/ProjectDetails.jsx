/**
 * CONCEPTS USED:
 * - URL Parameters (useParams)
 * - Data Fetching on Mount (useEffect)
 * - Component Composition (Tasks list)
 *
 * PURPOSE:
 * Displays single project details and manages its tasks.
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import * as api from '../services/api';

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const { tasks, addTask, updateTaskStatus, removeTask } = useTasks(id);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.getProjectById(id);
        if (res.data.success) setProject(res.data.data.project);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await addTask({ title: newTaskTitle });
    setNewTaskTitle('');
  };

  if (loading) return <div>Loading Project Details...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button onClick={() => navigate('/projects')} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: 0 }}>&larr; Back to Projects</button>
        <button onClick={() => navigate(`/projects/${id}/mentor`)} style={{ background: 'var(--info)', color: 'white', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)' }}>
          Ask AI Mentor
        </button>
      </div>
      
      <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h1>{project.title}</h1>
          <span style={{ background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', height: 'fit-content' }}>
            {project.status}
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>{project.description || 'No description.'}</p>
      </div>

      <h2>Tasks</h2>
      
      <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', marginTop: '1rem' }}>
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={e => setNewTaskTitle(e.target.value)} 
          placeholder="New task title..." 
          style={{ flex: 1, padding: '0.75rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', borderRadius: 'var(--radius-sm)' }}
        />
        <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)' }}>Add Task</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.map(task => (
          <div key={task._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: 'var(--radius-sm)', borderLeft: `4px solid ${task.status === 'COMPLETED' ? 'var(--success)' : 'var(--warning)'}` }}>
            <div>
              <h4 style={{ margin: 0, textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none', color: task.status === 'COMPLETED' ? 'var(--text-muted)' : 'inherit' }}>{task.title}</h4>
            </div>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <select 
                value={task.status} 
                onChange={e => updateTaskStatus(task._id, e.target.value)}
                style={{ background: 'var(--bg-main)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <button onClick={() => removeTask(task._id)} style={{ background: 'transparent', color: 'var(--danger)' }}>Delete</button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No tasks yet.</p>}
      </div>
    </div>
  );
}
