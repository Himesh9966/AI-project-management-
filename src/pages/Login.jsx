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
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)' }}>
      <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Welcome Back</h2>
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-input)', color: 'var(--text-primary)' }}
            required
          />
          <button type="submit" style={{ padding: '0.75rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', marginTop: '0.5rem' }}>
            Login
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <a href="/register">Sign up here</a>
        </p>
      </div>
    </div>
  );
}
