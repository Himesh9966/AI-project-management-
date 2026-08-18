/**
 * CONCEPTS USED:
 * - Controlled Components (Forms)
 * - State Management (useState)
 * - React Router Navigation (useNavigate)
 *
 * PURPOSE:
 * Login page for existing users.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '10%', left: '20%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '300px', height: '300px', background: 'var(--accent)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="glass-card" 
        style={{ padding: '3rem', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)', fontSize: '2rem' }}>
          Welcome <span style={{ color: 'var(--primary)' }}>Back</span>
        </h2>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', textAlign: 'center', background: 'rgba(255, 0, 85, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem', transition: 'var(--transition)' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = 'var(--shadow-glow)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem', transition: 'var(--transition)' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = 'var(--shadow-glow)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            required
          />
          <button 
            type="submit" 
            style={{ padding: '1rem', background: 'linear-gradient(45deg, var(--primary-dark), var(--primary))', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '1.1rem', marginTop: '1rem', boxShadow: 'var(--shadow-neon)', transition: 'var(--transition)' }}
            onMouseOver={(e) => e.target.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.target.style.filter = 'brightness(1)'}
          >
            Login to Workspace
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Create one</Link>
        </p>
      </motion.div>
    </div>
  );
}
