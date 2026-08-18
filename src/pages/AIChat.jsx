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
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
        <button onClick={() => navigate(`/projects/${id}`)} style={{ background: 'transparent', padding: 0 }}>&larr; Back to Project</button>
        <h2 style={{ margin: 0 }}>AI Mentor Chat</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid var(--border-color)' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
            Ask me anything about your project architecture, code, or prioritization!
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', background: msg.role === 'user' ? 'var(--primary-dark)' : 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', maxWidth: '80%', border: msg.role === 'user' ? 'none' : '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              {msg.role === 'user' ? 'You' : 'AI Mentor'}
            </div>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', background: 'var(--bg-main)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Mentor is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '1rem', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)', border: '1px solid var(--border-color)', borderTop: 'none' }}>
        <input 
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask a question about this project..."
          disabled={loading}
          style={{ flex: 1, padding: '1rem', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', color: 'white' }}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{ padding: '0 2rem', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-sm)', opacity: (loading || !input.trim()) ? 0.5 : 1 }}>
          Send
        </button>
      </form>
    </div>
  );
}
