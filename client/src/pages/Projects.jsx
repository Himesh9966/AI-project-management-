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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Projects</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)' }}
        >
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input 
            type="text" placeholder="Project Title" required value={newTitle} onChange={e => setNewTitle(e.target.value)}
            style={{ padding: '0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'white' }}
          />
          <textarea 
            placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)}
            style={{ padding: '0.75rem', background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'white', minHeight: '100px' }}
          />
          <button type="submit" style={{ padding: '0.75rem', background: 'var(--success)', color: 'white', border: 'none', cursor: 'pointer' }}>Create Project</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {projects.map(project => (
          <div key={project._id} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', position: 'relative' }}>
            <div onClick={() => navigate(`/projects/${project._id}`)} style={{ cursor: 'pointer' }}>
              <h3 style={{ marginBottom: '0.5rem', paddingRight: '2rem' }}>{project.title}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Status: {project.status}</p>
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
    </div>
  );
}
