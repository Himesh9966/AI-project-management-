/**
 * CONCEPTS USED:
 * - Component Composition
 * - Custom Hooks (useProjects)
 * - Data Aggregation & Display
 *
 * PURPOSE:
 * Dashboard showing overall project statistics and recent projects.
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const StatsCard = ({ title, value, color }) => (
  <motion.div 
    whileHover={{ scale: 1.05, rotateX: 2, rotateY: -2, boxShadow: `0 10px 30px ${color}33` }}
    style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${color}`, boxShadow: 'var(--shadow-sm)', transition: 'transform 0.1s' }}
  >
    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', textShadow: `0 0 10px ${color}` }}>{value}</p>
  </motion.div>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { projects, loading, removeProject } = useProjects();
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this project?')) {
      await removeProject(id);
    }
  };

  if (loading) return <div>Loading Dashboard...</div>;

  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ position: 'relative' }}>
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(200px)', opacity: 0.15, borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: 'var(--accent)', filter: 'blur(200px)', opacity: 0.15, borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />

      <motion.div variants={pageVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem', fontSize: '2.5rem' }}>Welcome, <span style={{ color: 'var(--primary)', textShadow: 'var(--shadow-glow)' }}>{user?.name}</span>!</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's an overview of your projects.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          style={{ padding: '0.75rem 1.5rem', background: 'rgba(255, 0, 85, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
        >
          Logout
        </motion.button>
      </motion.div>

      <motion.div variants={pageVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
        <StatsCard title="Total Projects" value={projects.length} color="var(--primary)" />
        <StatsCard title="Active" value={activeProjects} color="var(--warning)" />
        <StatsCard title="Completed" value={completedProjects} color="var(--success)" />
      </motion.div>

      <motion.div variants={pageVariants} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '2rem' }}>Recent Projects</h2>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: 'var(--shadow-glow)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/projects')}
          style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}
        >
          View All Projects
        </motion.button>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div variants={pageVariants} className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>You don't have any projects yet.</p>
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 170, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/ai-planner')} 
            style={{ padding: '1rem 2rem', background: 'var(--success)', color: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '1.1rem' }}
          >
            Generate a Project with AI
          </motion.button>
        </motion.div>
      ) : (
        <motion.div variants={pageVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {projects.slice(0, 3).map(project => (
            <motion.div 
              key={project._id} 
              whileHover={{ scale: 1.03, y: -5 }}
              className="glass-card"
              style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}
            >
              <div onClick={() => navigate(`/projects/${project._id}`)} style={{ cursor: 'pointer' }}>
                <h3 style={{ marginBottom: '1rem', paddingRight: '2rem', fontSize: '1.5rem', color: 'var(--primary)' }}>{project.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description || 'No description provided.'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-full)', color: 'var(--text-primary)' }}>{project.status}</span>
                  <span style={{ padding: '0.35rem 0.75rem', background: 'rgba(0, 240, 255, 0.1)', border: '1px solid var(--primary-light)', borderRadius: 'var(--radius-full)', color: 'var(--primary)' }}>{project.progress}% Complete</span>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.1, color: '#ff003c' }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => handleDelete(e, project._id)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', fontSize: '0.9rem', padding: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                title="Delete Project"
              >
                Delete
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
