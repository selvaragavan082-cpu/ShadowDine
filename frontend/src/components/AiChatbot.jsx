import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import { chatWithGemini } from '../services/aiService';

const AiChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: '👋 Hello! I am ShadowDine AI. How can I assist you with fine dining reservations or dish recommendations today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    // Append user message
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/ai/chat`, { prompt: userText });
      const aiReply = res.data?.reply || res.data?.message || 'I am here to help you reserve tables and pick fine dining options!';
      setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    } catch (err) {
      console.error('API Chat Error:', err);
      try {
        const aiReply = await chatWithGemini(userText);
        setMessages((prev) => [...prev, { sender: 'ai', text: aiReply }]);
      } catch (geminiErr) {
        console.error('Gemini AI Direct Error:', geminiErr);
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: '🤖 I am experiencing a temporary connection hiccup, but I can recommend trying our Chef’s Signature Biryani and Truffle Pasta!'
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, fontFamily: "'Inter', sans-serif" }}>
      {/* FLOATING CHAT WIDGET TOGGLE BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 22px',
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            color: '#0F172A',
            border: 'none',
            borderRadius: '30px',
            fontWeight: '800',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
            transition: 'transform 0.2s'
          }}
        >
          <span style={{ fontSize: '20px' }}>✨</span>
          <span>Ask Gemini AI</span>
        </button>
      )}

      {/* CHATBOT WINDOW */}
      {isOpen && (
        <div
          style={{
            width: '360px',
            height: '480px',
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <div
            style={{
              padding: '16px 20px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '22px' }}>✨</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#FFF' }}>ShadowDine AI</h3>
                <span style={{ fontSize: '11px', color: '#4ADE80', fontWeight: '600' }}>● Powered by Gemini 2.5</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: '20px',
                cursor: 'pointer',
                fontWeight: '700'
              }}
            >
              ✕
            </button>
          </div>

          {/* MESSAGES BODY */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'rgba(30, 41, 59, 0.8)',
                  color: msg.sender === 'user' ? '#0F172A' : '#F8FAFC',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  fontWeight: msg.sender === 'user' ? '700' : '500',
                  border: msg.sender === 'ai' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '10px 16px',
                  borderRadius: '18px 18px 18px 2px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  color: '#94A3B8',
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}
              >
                ✨ Gemini AI is thinking...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '12px 16px',
              background: 'rgba(15, 23, 42, 0.9)',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              gap: '10px'
            }}
          >
            <input
              type="text"
              placeholder="Ask about dishes or dining..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '20px',
                color: '#FFF',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                padding: '12px 18px',
                background: input.trim() ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' : 'rgba(255,255,255,0.1)',
                color: input.trim() ? '#0F172A' : '#64748B',
                border: 'none',
                borderRadius: '20px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: input.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiChatbot;
