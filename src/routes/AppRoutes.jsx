/**
 * CONCEPTS USED:
 * - Client-Side Routing (React Router)
 * - Protected Routes Pattern
 * - Component Composition
 *
 * PURPOSE:
 * Defines the navigation tree and protects authenticated routes from unauthorized access.
 */

import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// We will import pages here once created
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import ProjectDetails from '../pages/ProjectDetails';
import AIPlanner from '../pages/AIPlanner';
import AIChat from '../pages/AIChat';

// Layout wrapper for authenticated pages (e.g. Navigation bar)
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading Application...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="app-layout">
      {/* Navbar placeholder */}
      <nav style={{ padding: '1rem 2rem', background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: 'var(--primary)', margin: 0 }}>🤖 AI Mentor</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/dashboard">Dashboard</a>
          <a href="/projects">Projects</a>
          <a href="/ai-planner">AI Planner</a>
        </div>
      </nav>
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div>Initializing...</div>;

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/ai-planner" element={<AIPlanner />} />
        <Route path="/projects/:id/mentor" element={<AIChat />} />
      </Route>
      
      <Route path="*" element={<div>404 Page Not Found</div>} />
    </Routes>
  );
}
