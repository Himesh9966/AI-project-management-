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
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

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
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ position: 'relative' }}>
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'var(--primary)', filter: 'blur(250px)', opacity: 0.1, borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <motion.button whileHover={{ x: -5 }} onClick={() => navigate('/projects')} style={{ background: 'transparent', color: 'var(--text-secondary)', padding: 0 }}>&larr; Back to Projects</motion.button>
        <motion.button whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-glow)' }} whileTap={{ scale: 0.95 }} onClick={() => navigate(`/projects/${id}/mentor`)} style={{ background: 'linear-gradient(45deg, var(--info), var(--primary))', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
          Ask AI Mentor
        </motion.button>
      </div>
      
      <motion.div variants={pageVariants} className="glass-card" style={{ padding: '2.5rem', borderRadius: 'var(--radius-lg)', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{project.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginTop: '1rem', maxWidth: '800px' }}>{project.description || 'No description.'}</p>
          </div>
          <span style={{ background: 'rgba(0, 240, 255, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary-light)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
            {project.status}
          </span>
        </div>
      </motion.div>

      <motion.h2 variants={pageVariants} style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Tasks</motion.h2>
      
      <motion.form variants={pageVariants} onSubmit={handleAddTask} className="glass-card" style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', padding: '1.5rem' }}>
        <input 
          type="text" 
          value={newTaskTitle} 
          onChange={e => setNewTaskTitle(e.target.value)} 
          placeholder="New task title..." 
          style={{ flex: 1, padding: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}
        />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" style={{ padding: '1rem 2rem', background: 'var(--primary)', color: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '1rem' }}>Add Task</motion.button>
      </motion.form>

      <motion.div variants={pageVariants} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {tasks.map(task => (
          <motion.div key={task._id} whileHover={{ x: 5 }} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderLeft: `4px solid ${task.status === 'COMPLETED' ? 'var(--success)' : 'var(--warning)'}` }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', textDecoration: task.status === 'COMPLETED' ? 'line-through' : 'none', color: task.status === 'COMPLETED' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{task.title}</h4>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <select 
                value={task.status} 
                onChange={e => updateTaskStatus(task._id, e.target.value)}
                style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', outline: 'none' }}
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <motion.button whileHover={{ color: '#ff0055', scale: 1.1 }} onClick={() => removeTask(task._id)} style={{ background: 'transparent', color: 'var(--text-muted)', fontWeight: 600 }}>Delete</motion.button>
            </div>
          </motion.div>
        ))}
        {tasks.length === 0 && <p style={{ color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)' }}>No tasks yet.</p>}
      </motion.div>
    </motion.div>
  );
}
