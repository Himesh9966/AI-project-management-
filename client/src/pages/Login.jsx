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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';

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
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden">
      
      {/* Background Metallic Glows */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[20%] w-[300px] h-[300px] bg-[#333] blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-10 p-4"
      >
        <Card className="w-full metallic-panel border-white/5 bg-[#111]/80 backdrop-blur-2xl p-4">
          <CardHeader className="text-center space-y-2 mb-2">
            <CardTitle className="text-2xl text-white font-medium tracking-tight">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400">
              Sign in to your workspace
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <div className="text-red-400 mb-6 text-center bg-red-950/30 border border-red-900/50 p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3.5 rounded-lg border border-[#333] bg-[#1a1a1a] text-white text-sm transition-all focus:border-[#555] focus:ring-1 focus:ring-[#555] outline-none placeholder:text-gray-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3.5 rounded-lg border border-[#333] bg-[#1a1a1a] text-white text-sm transition-all focus:border-[#555] focus:ring-1 focus:ring-[#555] outline-none placeholder:text-gray-500"
                required
              />
              <Button 
                type="submit" 
                variant="metallic"
                className="w-full mt-2 py-6 text-sm"
              >
                Login to Workspace
              </Button>
            </form>
            <p className="text-center mt-6 text-gray-400 text-sm">
              Don't have an account? <Link to="/register" className="text-white hover:text-gray-200 transition-colors">Create one</Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
