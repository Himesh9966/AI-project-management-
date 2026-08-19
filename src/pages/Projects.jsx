/**
 * CONCEPTS USED:
 * - List Rendering
 * - State Management
 *
 * PURPOSE:
 * Displays all projects and allows creation of new ones.
 */

import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function Projects() {
  const { projects, loading, addProject, removeProject } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    await addProject({ title: newTitle, description: newDesc });
    setShowForm(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this project?')) {
      await removeProject(id);
    }
  };

  if (loading) return <div>Loading Projects...</div>;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ position: 'relative' }}>
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '10%', right: '-10%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(200px)', opacity: 0.15, borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />

      <motion.div variants={pageVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem' }}>My Projects</h1>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-glow)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '0.75rem 1.5rem', background: showForm ? 'rgba(255, 255, 255, 0.1)' : 'var(--primary)', color: showForm ? 'var(--text-primary)' : 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600, border: showForm ? '1px solid var(--border-color)' : 'none' }}
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.form 
            initial={{ opacity: 0, height: 0, scale: 0.9 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.9 }}
            onSubmit={handleCreate} 
            className="glass-card"
            style={{ padding: '2rem', marginBottom: '3rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <h3 style={{ margin: 0, color: 'var(--primary)' }}>Create New Project</h3>
            <input 
              type="text" placeholder="Project Title" required value={newTitle} onChange={e => setNewTitle(e.target.value)}
              style={{ padding: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}
            />
            <textarea 
              placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)}
              style={{ padding: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'white', minHeight: '120px', borderRadius: 'var(--radius-sm)', fontSize: '1rem' }}
            />
            <motion.button 
              whileHover={{ filter: 'brightness(1.1)' }}
              whileTap={{ scale: 0.95 }}
              type="submit" 
              style={{ padding: '1rem', background: 'linear-gradient(45deg, var(--success), #00cc88)', color: 'var(--bg-main)', border: 'none', cursor: 'pointer', fontWeight: 600, borderRadius: 'var(--radius-sm)', fontSize: '1.1rem' }}
            >
              Create Project
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div variants={pageVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {projects.map(project => (
          <motion.div 
            key={project._id} 
            whileHover={{ scale: 1.03, y: -5 }}
            className="glass-card"
            style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}
          >
            <div onClick={() => navigate(`/projects/${project._id}`)} style={{ cursor: 'pointer' }}>
              <h3 style={{ marginBottom: '1rem', paddingRight: '2rem', fontSize: '1.5rem', color: 'var(--primary)' }}>{project.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description || 'No description provided.'}</p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', color: 'var(--text-primary)', fontSize: '0.85rem' }}>{project.status}</span>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.1, color: '#ff003c' }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleDelete(e, project._id)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0.5rem', fontWeight: 600 }}
              title="Delete Project"
            >
              Delete
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
