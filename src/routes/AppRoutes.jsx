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
  <div className="flex justify-center items-center h-screen bg-[#050505] text-white">
    <h2 className="animate-pulse tracking-widest uppercase text-sm font-semibold text-gray-400">Loading...</h2>
  </div>
);

// Layout wrapper for authenticated pages
const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Glassmorphism/Metallic Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center shadow-sm">
        <Link to="/dashboard" className="no-underline">
          <h2 className="text-white text-xl font-semibold m-0 tracking-tight">
            AI Mentor
          </h2>
        </Link>
        <div className="flex gap-6 items-center">
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Dashboard</Link>
          <Link to="/projects" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Projects</Link>
          <Link to="/ai-planner" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">AI Planner</Link>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-7xl mx-auto p-8 relative">
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
          
          <Route path="*" element={<div className="text-center p-20 text-red-500 font-bold text-2xl"><h1>404 - Lost in Space</h1></div>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}
