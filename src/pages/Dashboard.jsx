/**
 * CONCEPTS USED:
 * - Component Composition
 * - Custom Hooks (useProjects)
 * - Data Aggregation & Display
 *
 * PURPOSE:
 * Dashboard showing overall project statistics and recent projects.
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProjects } from '../hooks/useProjects';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LayoutDashboard, CheckCircle, Clock } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const StatsCard = ({ title, value, icon: Icon }) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -2 }}
    className="transition-all"
  >
    <Card className="border-white/5 bg-[#111]/80 backdrop-blur-md overflow-hidden relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</CardTitle>
        <Icon className="h-5 w-5 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-white tracking-tight">{value}</div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { projects, loading, removeProject } = useProjects();
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this project?')) {
      await removeProject(id);
    }
  };

  if (loading) return <div className="text-gray-400 text-center py-20">Loading Dashboard...</div>;

  const activeProjects = projects.filter(p => p.status === 'IN_PROGRESS').length;
  const completedProjects = projects.filter(p => p.status === 'COMPLETED').length;

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="relative pb-20">
      {/* Background Metallic Accents */}
      <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full z-[-1] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] bg-zinc-800/20 blur-[150px] rounded-full z-[-1] pointer-events-none" />

      <motion.div variants={pageVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 mt-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-white mb-2">
            Welcome, <span className="text-gray-300">{user?.name}</span>
          </h1>
          <p className="text-gray-400 text-lg">Here's an overview of your projects.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={logout}
          className="border-red-900/50 text-red-400 hover:bg-red-950/30 hover:text-red-300 w-full md:w-auto"
        >
          Logout
        </Button>
      </motion.div>

      <motion.div variants={pageVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <StatsCard title="Total Projects" value={projects.length} icon={LayoutDashboard} />
        <StatsCard title="Active" value={activeProjects} icon={Clock} />
        <StatsCard title="Completed" value={completedProjects} icon={CheckCircle} />
      </motion.div>

      <motion.div variants={pageVariants} className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Recent Projects</h2>
        <Button 
          variant="metallic"
          onClick={() => navigate('/projects')}
        >
          View All Projects
        </Button>
      </motion.div>

      {projects.length === 0 ? (
        <motion.div variants={pageVariants}>
          <Card className="p-12 text-center border-white/5 bg-[#111]/60 border-dashed border-2">
            <p className="text-gray-400 mb-6 text-lg">You don't have any projects yet.</p>
            <Button 
              variant="default"
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => navigate('/ai-planner')} 
            >
              Generate a Project with AI
            </Button>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={pageVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.slice(0, 3).map(project => (
            <motion.div 
              key={project._id} 
              whileHover={{ y: -4 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <Card className="h-full border-white/5 bg-[#111]/80 backdrop-blur-sm overflow-hidden relative transition-all duration-300 hover:border-white/10 hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)]">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button 
                    onClick={(e) => handleDelete(e, project._id)}
                    className="text-xs font-medium text-gray-500 hover:text-red-400 bg-black/50 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
                <CardContent className="p-6 h-full flex flex-col">
                  <h3 className="text-xl font-medium text-white mb-3 pr-8 truncate">{project.title}</h3>
                  <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">
                    {project.description || 'No description provided.'}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-white/5 mt-auto">
                    <span className="px-3 py-1 text-xs font-medium bg-white/5 text-gray-300 rounded-full border border-white/10">
                      {project.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-medium text-gray-400">
                      {project.progress}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
