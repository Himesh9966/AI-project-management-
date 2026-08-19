/**
 * CONCEPTS USED:
 * - Controlled Components
 * - Error Handling
 * - React Router Navigation
 *
 * PURPOSE:
 * Registration page for new users.
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required.";
    if (!email.includes('@')) errors.email = "Please enter a valid email address.";
    if (password.length < 6) errors.password = "Password must be at least 6 characters long.";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Glows */}
      <div style={{ position: 'absolute', top: '20%', right: '20%', width: '300px', height: '300px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '300px', height: '300px', background: 'var(--secondary)', filter: 'blur(150px)', opacity: 0.2, borderRadius: '50%' }} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5 }}
        className="glass-card" 
        style={{ padding: '3rem', width: '100%', maxWidth: '420px', position: 'relative', zIndex: 10 }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)', fontSize: '2rem' }}>
          Create <span style={{ color: 'var(--primary)' }}>Account</span>
        </h2>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', textAlign: 'center', background: 'rgba(255, 0, 85, 0.1)', padding: '0.75rem', borderRadius: 'var(--radius-sm)' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem', transition: 'var(--transition)' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = 'var(--shadow-glow)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            required
          />
          {validationErrors.name && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '-1rem' }}>{validationErrors.name}</span>}
          
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
          {validationErrors.email && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '-1rem' }}>{validationErrors.email}</span>}
          
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)', fontSize: '1rem', transition: 'var(--transition)' }}
            onFocus={(e) => { e.target.style.borderColor = 'var(--primary)'; e.target.style.boxShadow = 'var(--shadow-glow)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border-color)'; e.target.style.boxShadow = 'none'; }}
            required
          />
          {validationErrors.password && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '-1rem' }}>{validationErrors.password}</span>}
          
          <button 
            type="submit" 
            style={{ padding: '1rem', background: 'linear-gradient(45deg, var(--primary-dark), var(--primary))', color: '#fff', borderRadius: 'var(--radius-md)', fontWeight: '600', fontSize: '1.1rem', marginTop: '1rem', boxShadow: 'var(--shadow-neon)', transition: 'var(--transition)' }}
            onMouseOver={(e) => e.target.style.filter = 'brightness(1.1)'}
            onMouseOut={(e) => e.target.style.filter = 'brightness(1)'}
          >
            Create Account
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>Log in here</Link>
        </p>
      </motion.div>
    </div>
  );
}
