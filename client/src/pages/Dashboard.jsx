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

const StatsCard = ({ title, value, color }) => (
  <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', borderLeft: `4px solid ${color}`, boxShadow: 'var(--shadow-sm)' }}>
    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</h3>
    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{value}</p>
  </div>
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Welcome, {user?.name}!</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's an overview of your projects.</p>
        </div>
        <button 
          onClick={logout}
          style={{ padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)' }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatsCard title="Total Projects" value={projects.length} color="var(--primary)" />
        <StatsCard title="Active" value={activeProjects} color="var(--warning)" />
        <StatsCard title="Completed" value={completedProjects} color="var(--success)" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Recent Projects</h2>
        <button 
          onClick={() => navigate('/projects')}
          style={{ padding: '0.5rem 1rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)' }}
        >
          View All Projects
        </button>
      </div>

      {projects.length === 0 ? (
        <div style={{ background: 'var(--bg-card)', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-md)' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>You don't have any projects yet.</p>
          <button onClick={() => navigate('/ai-planner')} style={{ padding: '0.75rem 1.5rem', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius-sm)' }}>
            Generate a Project with AI
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {projects.slice(0, 3).map(project => (
            <div key={project._id} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', position: 'relative' }}>
              <div onClick={() => navigate(`/projects/${project._id}`)} style={{ cursor: 'pointer' }}>
                <h3 style={{ marginBottom: '0.5rem', paddingRight: '2rem' }}>{project.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description || 'No description provided.'}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                  <span style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-full)' }}>{project.status}</span>
                  <span style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-full)' }}>{project.progress}% Complete</span>
                </div>
              </div>
              <button 
                onClick={(e) => handleDelete(e, project._id)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', color: 'var(--danger, #ff4444)', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0' }}
                title="Delete Project"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
