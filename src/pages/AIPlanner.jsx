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
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function AIPlanner() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [model, setModel] = useState(null);
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

  const handleModelProblem = async (e) => {
    e.preventDefault();
    if (!idea.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await api.modelProblem(idea);
      if (res.data.success) {
        setModel(res.data.data.model);
        setPlan(null); // Clear plan if showing model
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to model problem.');
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
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ position: 'relative' }}>
      
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(200px)', opacity: 0.15, borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: '400px', height: '400px', background: 'var(--accent)', filter: 'blur(200px)', opacity: 0.15, borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />

      <motion.h1 variants={pageVariants} style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 15px rgba(0,240,255,0.2))' }}>
        AI Project Planner
      </motion.h1>
      <motion.p variants={pageVariants} style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '3rem' }}>
        Describe your idea and the AI Mentor will generate a structured MVP plan with tasks.
      </motion.p>

      <motion.form variants={pageVariants} onSubmit={handleGenerate} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem', padding: '2rem' }}>
        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., I want to build a food delivery application using the MERN stack..."
          style={{ width: '100%', minHeight: '150px', padding: '1.5rem', background: 'var(--bg-input)', color: 'white', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: '1.1rem' }}
          required
        />
        <div style={{ display: 'flex', gap: '1rem' }}>
          <motion.button 
            whileHover={!loading ? { scale: 1.02, boxShadow: 'var(--shadow-glow)' } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            type="submit" 
            disabled={loading}
            style={{ padding: '1rem 2rem', background: 'linear-gradient(45deg, var(--primary-dark), var(--primary))', color: '#fff', borderRadius: 'var(--radius-sm)', width: 'fit-content', opacity: loading ? 0.7 : 1, fontWeight: 600, fontSize: '1.1rem' }}
          >
            {loading ? 'Analyzing...' : 'Generate Plan'}
          </motion.button>

          <motion.button 
            whileHover={!loading ? { scale: 1.02, boxShadow: 'var(--shadow-glow)' } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            type="button" 
            onClick={handleModelProblem}
            disabled={loading}
            style={{ padding: '1rem 2rem', background: 'linear-gradient(45deg, var(--accent), var(--secondary))', color: '#fff', borderRadius: 'var(--radius-sm)', width: 'fit-content', opacity: loading ? 0.7 : 1, fontWeight: 600, fontSize: '1.1rem' }}
          >
            {loading ? 'Modeling...' : 'Model Problem'}
          </motion.button>
        </div>
      </motion.form>

      {error && <motion.div variants={pageVariants} style={{ color: 'var(--danger)', marginBottom: '1rem', background: 'rgba(255,0,85,0.1)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>{error}</motion.div>}

      {plan && (
        <motion.div variants={pageVariants} className="glass-card" style={{ padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>{plan.projectTitle}</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem', fontSize: '1.1rem', maxWidth: '800px' }}>{plan.summary}</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 170, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateProject} 
              style={{ padding: '1rem 2rem', background: 'linear-gradient(45deg, #00cc88, var(--success))', color: 'var(--bg-main)', borderRadius: 'var(--radius-full)', fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              Create as Project
            </motion.button>
          </div>

          <div style={{ margin: '2.5rem 0' }}>
            <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>Suggested Tech Stack: </strong>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {plan.techStack?.map(t => <span key={t} style={{ padding: '0.5rem 1rem', background: 'rgba(0, 240, 255, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary-light)', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>{t}</span>)}
            </div>
          </div>

          <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', marginTop: '3rem' }}>Recommended Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {plan.tasks.map((task, idx) => (
              <motion.div key={idx} whileHover={{ x: 5 }} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>{task.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{task.description}</p>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--warning)', background: 'rgba(255, 170, 0, 0.1)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>Priority: {task.priority}</span>
                  <span style={{ color: 'var(--info)', background: 'rgba(0, 187, 255, 0.1)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)' }}>Est. Hours: {task.estimatedHours}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {model && (
        <motion.div variants={pageVariants} className="glass-card" style={{ padding: '3rem', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>{model.title}</h2>
          
          <h3 style={{ fontSize: '1.5rem', marginTop: '2rem', color: 'var(--text-primary)' }}>Actors</h3>
          <ul>
            {model.actors?.map((actor, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                <strong style={{ color: 'var(--primary)' }}>{actor.name}:</strong> {actor.description}
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: '1.5rem', marginTop: '2rem', color: 'var(--text-primary)' }}>Entities</h3>
          {model.entities?.map((entity, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--accent)', fontSize: '1.2rem' }}>{entity.name}</h4>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Attributes:</strong> {entity.attributes?.join(', ')}
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <strong>Relationships:</strong> {entity.relationships?.join(', ')}
              </div>
            </div>
          ))}

          <h3 style={{ fontSize: '1.5rem', marginTop: '2rem', color: 'var(--text-primary)' }}>Constraints</h3>
          <ul>
            {model.constraints?.map((constraint, idx) => (
              <li key={idx} style={{ marginBottom: '0.5rem', color: 'var(--warning)' }}>{constraint}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
}
