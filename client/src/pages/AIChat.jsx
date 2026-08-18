/**
 * CONCEPTS USED:
 * - Complex State Management
 * - AI Conversation Interface
 *
 * PURPOSE:
 * Provides a chat interface for the AI Mentor tied to a specific project.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../services/api';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3 } }
};

export default function AIChat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await api.askAIMentor(id, userMsg);
      if (res.data.success) {
        setMessages(prev => [...prev, { role: 'model', content: res.data.data.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'system', content: 'Error: Could not reach the AI Mentor.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', position: 'relative' }}>
      
      {/* Background Glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'var(--accent)', filter: 'blur(300px)', opacity: 0.1, borderRadius: '50%', zIndex: -1, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem', gap: '1.5rem' }}>
        <motion.button whileHover={{ x: -5 }} onClick={() => navigate(`/projects/${id}`)} style={{ background: 'transparent', padding: 0, color: 'var(--text-secondary)' }}>&larr; Back to Project</motion.button>
        <h2 style={{ margin: 0, fontSize: '2rem', color: 'var(--primary)' }}>AI Mentor Chat</h2>
      </div>

      <div className="glass-card" style={{ flex: 1, overflowY: 'auto', padding: '2rem', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', display: 'flex', flexDirection: 'column', gap: '1.5rem', borderBottom: 'none' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem', fontSize: '1.1rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>✨</div>
            Ask me anything about your project architecture, code, or prioritization!
          </div>
        )}
        {messages.map((msg, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx} 
            style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary-dark), var(--primary))' : 'rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: 'var(--radius-md)', maxWidth: '80%', border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)', boxShadow: msg.role === 'user' ? 'var(--shadow-glow)' : 'none' }}
          >
            <div style={{ fontSize: '0.85rem', color: msg.role === 'user' ? 'rgba(255,255,255,0.8)' : 'var(--primary)', marginBottom: '0.5rem', fontWeight: 600 }}>
              {msg.role === 'user' ? 'You' : 'AI Mentor'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: msg.role === 'user' ? '#fff' : 'var(--text-primary)', fontSize: '1.05rem' }}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--primary)', fontWeight: 500 }}>Mentor is thinking...</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="glass-card" style={{ display: 'flex', gap: '1rem', padding: '1.5rem', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about this project..."
          disabled={loading}
          style={{ flex: 1, padding: '1.25rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'white', fontSize: '1.05rem' }}
        />
        <motion.button 
          whileHover={(!loading && input.trim()) ? { scale: 1.05, boxShadow: 'var(--shadow-glow)' } : {}}
          whileTap={(!loading && input.trim()) ? { scale: 0.95 } : {}}
          type="submit" 
          disabled={loading || !input.trim()} 
          style={{ padding: '0 2.5rem', background: 'var(--primary)', color: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', fontSize: '1.1rem', opacity: (loading || !input.trim()) ? 0.5 : 1 }}
        >
          Send
        </motion.button>
      </form>
    </motion.div>
  );
}
