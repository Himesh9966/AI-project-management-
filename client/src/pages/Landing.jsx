import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, Float } from '@react-three/drei';
import { motion } from 'framer-motion';

const AnimatedShape = () => {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2}>
      <Sphere visible args={[1, 100, 200]} scale={1.5}>
        <MeshDistortMaterial
          color="#00f0ff"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
};

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: 'var(--bg-main)' }}>
      {/* 3D Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ff0055" />
          <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#7000ff" />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <AnimatedShape />
        </Canvas>
      </div>

      {/* Hero Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 2rem', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 style={{ fontSize: '4.5rem', fontWeight: 700, marginBottom: '1rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(0,240,255,0.3))' }}>
            AI Project Mentor
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '600px', marginBottom: '3rem' }}>
            Elevate your coding workflow. Let advanced AI plan, track, and guide your next massive software project.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ display: 'flex', gap: '1.5rem' }}
        >
          <button 
            onClick={() => navigate('/login')}
            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 600, background: 'linear-gradient(45deg, var(--primary-dark), var(--primary))', color: '#fff', borderRadius: 'var(--radius-full)', boxShadow: 'var(--shadow-neon)', transition: 'var(--transition)' }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Get Started
          </button>
          <button 
            onClick={() => navigate('/register')}
            style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', fontWeight: 600, background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', color: 'var(--primary)', border: '1px solid var(--primary-light)', borderRadius: 'var(--radius-full)', transition: 'var(--transition)' }}
            onMouseOver={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'var(--shadow-glow)'; }}
            onMouseOut={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.boxShadow = 'none'; }}
          >
            Create Account
          </button>
        </motion.div>
      </div>
    </div>
  );
}
