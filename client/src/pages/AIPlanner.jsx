/**
 * CONCEPTS USED:
 * - AI Integration
 * - Conditional UI Rendering
 * - Complex State Management
 *
 * PURPOSE:
 * Allows user to generate structured MVP plans using the AI backend.
 */

import React, { useState } from 'react';
import * as api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function AIPlanner() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await api.generateAIPlan(idea);
      if (res.data.success) {
        setPlan(res.data.data.plan.generatedPlan);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate plan.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!plan) return;
    try {
      const res = await api.createProject({
        title: plan.projectTitle,
        description: plan.summary
      });
      if (res.data.success) {
        const projectId = res.data.data.project._id;
        
        // Add tasks to the newly created project
        for (const task of plan.tasks) {
          await api.createTask(projectId, {
            title: task.title,
            description: task.description,
            priority: task.priority,
            estimatedHours: task.estimatedHours
          });
        }
        
        navigate(`/projects/${projectId}`);
      }
    } catch (err) {
      setError('Failed to convert plan into project.');
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1rem', background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        AI Project Planner
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Describe your idea and the AI Mentor will generate a structured MVP plan with tasks.
      </p>

      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., I want to build a food delivery application using the MERN stack..."
          style={{ width: '100%', minHeight: '120px', padding: '1rem', background: 'var(--bg-card)', color: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
          required
        />
        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)', width: 'fit-content', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Generating Plan...' : 'Generate Plan'}
        </button>
      </form>

      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}

      {plan && (
        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2>{plan.projectTitle}</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{plan.summary}</p>
            </div>
            <button onClick={handleCreateProject} style={{ padding: '0.5rem 1rem', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius-sm)' }}>
              Create as Project
            </button>
          </div>

          <div style={{ margin: '1.5rem 0' }}>
            <strong>Suggested Tech Stack: </strong>
            {plan.techStack?.map(t => <span key={t} style={{ marginLeft: '0.5rem', padding: '0.2rem 0.5rem', background: 'var(--bg-main)', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>{t}</span>)}
          </div>

          <h3>Recommended Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {plan.tasks.map((task, idx) => (
              <div key={idx} style={{ background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
                <h4 style={{ color: 'var(--secondary)' }}>{task.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{task.description}</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem' }}>
                  <span>Priority: {task.priority}</span>
                  <span>Est. Hours: {task.estimatedHours}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
