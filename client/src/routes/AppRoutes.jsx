/**
 * CONCEPTS USED:
 * - Client-Side Routing (React Router)
 * - Protected Routes Pattern
 * - Component Composition
 *
 * PURPOSE:
 * Defines the navigation tree and protects authenticated routes from unauthorized access.
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AnimatePresence } from 'framer-motion';

const Landing = lazy(() => import('../pages/Landing'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Projects = lazy(() => import('../pages/Projects'));
const ProjectDetails = lazy(() => import('../pages/ProjectDetails'));
const AIPlanner = lazy(() => import('../pages/AIPlanner'));
const AIChat = lazy(() => import('../pages/AIChat'));

const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-main)', color: 'var(--primary)' }}>
    <h2 style={{ filter: 'drop-shadow(var(--shadow-glow))' }}>Loading...</h2>
  </div>
);

// Layout wrapper for authenticated pages
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="app-layout">
      {/* Glassmorphism Navbar */}
      <nav style={{ 
        padding: '1rem 2rem', 
        background: 'rgba(10, 10, 15, 0.7)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <h2 style={{ color: 'var(--primary)', margin: 0, textShadow: '0 0 10px var(--primary-light)' }}>
            AI Mentor
          </h2>
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/dashboard" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Dashboard</Link>
          <Link to="/projects" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Projects</Link>
          <Link to="/ai-planner" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>AI Planner</Link>
        </div>
      </nav>
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/ai-planner" element={<AIPlanner />} />
            <Route path="/projects/:id/mentor" element={<AIChat />} />
          </Route>
          
          <Route path="*" element={<div style={{ textAlign: 'center', padding: '5rem', color: 'var(--danger)' }}><h1>404 - Lost in Space</h1></div>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
