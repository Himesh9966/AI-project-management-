import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/button';

// A metallic morphing sphere replacing the bright neon one
const MetallicCore = () => {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
      <Sphere visible args={[1, 100, 200]} scale={1.8}>
        <MeshDistortMaterial
          color="#888888"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.1}
          metalness={1}
          envMapIntensity={1}
        />
      </Sphere>
    </Float>
  );
};

export default function Landing() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Staggered text opacities for the huge scrolling text section
  const text1Opacity = useTransform(scrollYProgress, [0.1, 0.2, 0.3], [0, 1, 0]);
  const text2Opacity = useTransform(scrollYProgress, [0.3, 0.4, 0.5], [0, 1, 0]);
  const text3Opacity = useTransform(scrollYProgress, [0.5, 0.6, 0.7], [0, 1, 0]);
  const text4Opacity = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);
  const yOffset = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div ref={containerRef} className="relative w-full bg-[#E5E5E5] text-[#111] overflow-x-hidden font-sans antialiased" style={{ height: '500vh' }}>
      
      {/* Navbar matching KUBO style */}
      <nav className="fixed top-0 left-0 w-full px-6 lg:px-16 py-6 flex justify-between items-center z-50 text-gray-900">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-2xl font-bold tracking-tight"
        >
          MENTOR
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="flex gap-6 items-center"
        >
          <Button 
            variant="default" 
            onClick={() => navigate('/login')}
            className="bg-black text-white hover:bg-gray-800"
          >
            Sign In
          </Button>
        </motion.div>
      </nav>

      {/* Hero Section (Sticky) */}
      <div className="sticky top-0 h-screen w-full flex flex-col lg:flex-row items-center justify-between px-6 lg:px-16 py-20 overflow-hidden">
        
        {/* Background Gradients & Noise */}
        <div className="absolute inset-0 bg-[#E5E5E5] z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(229,229,229,0.95)_100%)] z-0 pointer-events-none" />

        {/* Text Content */}
        <div className="w-full lg:w-[45%] z-20 flex flex-col justify-center mt-20 lg:mt-0">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}
            className="text-[3rem] sm:text-[4rem] lg:text-[4.5rem] leading-[1] tracking-tight font-medium mb-6 text-[#1A1A1A]"
          >
            A physical AI planner that builds your ideas.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
            className="text-lg lg:text-xl text-[#555] mb-10 max-w-[500px] font-light leading-relaxed"
          >
            MENTOR sees your code, plans your architecture, and responds in real-time. Designed to bring structure and intelligence to your workspace.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Button 
              className="bg-[#111] hover:bg-black text-white px-8 py-7 rounded-full text-lg font-medium shadow-[0_10px_20px_rgba(0,0,0,0.1)] transition-transform hover:scale-105"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              className="border-[#BBB] hover:border-[#888] bg-transparent text-[#333] hover:bg-transparent px-8 py-7 rounded-full text-lg font-medium transition-colors"
              onClick={() => navigate('/login')}
            >
              Enter Workspace
            </Button>
          </motion.div>
        </div>

        {/* 3D Object */}
        <motion.div 
          style={{ y: yOffset }}
          className="w-full lg:w-[50%] h-[50vh] lg:h-[80vh] relative z-10 flex items-center justify-center mt-12 lg:mt-0"
        >
          <div className="absolute w-[150%] h-[150%] opacity-40 mix-blend-multiply pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white rounded-full blur-[100px]" />
          </div>
          <Canvas camera={{ position: [0, 0, 5] }} className="pointer-events-none scale-125 lg:scale-150">
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
            <directionalLight position={[-10, -10, -5]} intensity={1} color="#a0a0a0" />
            <Environment preset="city" />
            <MetallicCore />
          </Canvas>
          {/* Base shadow */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[200px] h-8 bg-black/20 blur-[20px] rounded-[100%]" />
        </motion.div>
      </div>

      {/* Massive Scroll Text Section */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-30 text-gray-900 px-4">
        <motion.h2 
          style={{ opacity: text1Opacity }}
          className="absolute text-center text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight"
        >
          Code is overwhelming.
        </motion.h2>
        <motion.h2 
          style={{ opacity: text2Opacity }}
          className="absolute text-center text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight"
        >
          Too many files.
        </motion.h2>
        <motion.h2 
          style={{ opacity: text3Opacity }}
          className="absolute text-center text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight"
        >
          Endless refactoring.
        </motion.h2>
        <motion.div 
          style={{ opacity: text4Opacity }}
          className="absolute flex flex-col items-center gap-8"
        >
          <h2 className="text-center text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            You need an AI planner<br/>that understands context.
          </h2>
          <Button className="pointer-events-auto bg-black text-white hover:bg-gray-800 px-8 py-6 rounded-full text-lg mt-8" onClick={() => navigate('/register')}>
            Start Building Now
          </Button>
        </motion.div>
      </div>
      
      {/* Floating Notifications mimicking kubo style */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.15, 0.25], [0, 1]), y: useTransform(scrollYProgress, [0.15, 0.4], [100, -100]) }}
          className="absolute top-[20%] left-[10%] w-[280px] bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] p-4 -rotate-3"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm text-gray-900">GitHub</span>
            <span className="text-xs text-gray-500">Just now</span>
          </div>
          <p className="text-sm text-gray-700">CI Build Failed - main branch</p>
        </motion.div>

        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.35, 0.45], [0, 1]), y: useTransform(scrollYProgress, [0.35, 0.6], [100, -100]) }}
          className="absolute top-[60%] right-[15%] w-[280px] bg-white/70 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.1)] p-4 rotate-2"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-sm text-gray-900">Slack</span>
            <span className="text-xs text-gray-500">2m ago</span>
          </div>
          <p className="text-sm text-gray-700">Design Team: We need the assets ASAP</p>
        </motion.div>

        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0.55, 0.65], [0, 1]), y: useTransform(scrollYProgress, [0.55, 0.8], [100, -100]) }}
          className="absolute top-[30%] right-[30%] w-[320px] bg-white/90 backdrop-blur-2xl border border-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 rotate-1"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-sm text-blue-600 uppercase tracking-wider">Action Complete</span>
          </div>
          <p className="text-base font-semibold text-gray-900">Meeting rescheduled to 3 PM</p>
        </motion.div>
      </div>

    </div>
  );
}
