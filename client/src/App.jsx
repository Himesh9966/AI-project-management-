/**
 * CONCEPTS USED:
 * - React Functional Component
 * - Component State & Side Effects (useState, useEffect)
 * - Modern CSS Modules / Layout Composition
 *
 * PURPOSE:
 * Root application component for AI Project Mentor client.
 *
 * RESPONSIBILITY:
 * Serves as the top-level application container.
 */

import React, { useState, useEffect } from 'react';

export default function App() {
  const [serverStatus, setServerStatus] = useState('checking...');

  useEffect(() => {
    fetch('http://localhost:5001/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setServerStatus('Connected to Backend (HTTP 200 OK on Port 5001)');
        } else {
          setServerStatus('Backend returned error');
        }
      })
      .catch(() => {
        setServerStatus('Backend offline (Run npm run dev to start both)');
      });
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        padding: '2.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖 🚀</div>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.75rem', background: 'linear-gradient(135deg, #6366f1, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AI Project Mentor
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Production-quality full-stack MVP to help students plan, manage, and complete software engineering projects with AI guidance.
        </p>

        <div style={{
          padding: '1rem',
          backgroundColor: 'var(--bg-main)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          fontSize: '0.9rem',
          color: serverStatus.includes('Connected') ? 'var(--success)' : 'var(--warning)'
        }}>
          <strong>System Status:</strong> {serverStatus}
        </div>
      </div>
    </div>
  );
}
