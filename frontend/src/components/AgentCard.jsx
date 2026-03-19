import React, { useState } from 'react';
import { Brain, Zap, AlertCircle, Clock, Copy, Check } from 'lucide-react';

export default function AgentCard({ agent }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);

  const diffColor = (diff) => {
    const colors = {
      easy: { text: '#059669', border: '#10b98144', bg: '#10b98111' },
      medium: { text: '#d97706', border: '#fbbf2444', bg: '#fbbf2411' },
      hard: { text: '#dc2626', border: '#ef444444', bg: '#ef444411' },
      default: { text: '#4f46e5', border: '#6366f144', bg: '#6366f111' }
    };
    const c = colors[diff?.toLowerCase()] || colors.default;
    return { color: c.text, borderColor: c.border, backgroundColor: c.bg };
  };

  return (
    <div 
      className={`flip-card ${isFlipped ? 'flipped' : ''}`} 
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        
        {/* Front of Card */}
        <div className="flip-card-front p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-5">
              <div style={{ padding: '0.75rem', background: 'var(--accent-glow)', borderRadius: '14px', border: '1px solid var(--card-border)' }}>
                <Brain style={{ color: '#6366f1' }} size={24} />
              </div>
              <span 
                className="diff-badge"
                style={diffColor(agent.difficulty)}
              >
                {agent.difficulty || 'Medium'}
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: '1.2', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {agent.name}
              {agent.schedule && agent.schedule.trigger && agent.schedule.trigger !== 'None' && (
                <Clock size={16} style={{ color: '#f59e0b', filter: 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.2))' }} />
              )}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>{agent.summary}</p>
          </div>
          
          <div className="mt-auto">
            <div style={{ fontSize: '0.6rem', fontWeight: '800', color: 'var(--text-secondary)', opacity: 0.6, letterSpacing: '0.05em', marginBottom: '0.4rem' }}>CONNECTORS</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: '600' }}>
              {agent.connectors?.join(' • ') || 'General'}
            </p>
          </div>  
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.7rem', color: '#6366f1', fontWeight: '700', opacity: 0.8 }}>
            Click for Blueprint →
          </div>
        </div>

        {/* Back of Card */}
        <div className="flip-card-back p-8 flex flex-col custom-scrollbar">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
            <Zap style={{ color: '#f59e0b' }} size={18} />
            <h4 style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '0.05em' }}>AGENT BLUEPRINT</h4>
          </div>
          
          <div className="flex-1 flex flex-col">
            <div className="mb-5">
              <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>MODEL</div>
              <div style={{ 
                fontSize: '0.8rem', 
                fontWeight: '600', 
                color: 'var(--text-primary)', 
                background: 'var(--accent-glow)', 
                padding: '0.6rem 0.8rem', 
                borderRadius: '10px', 
                border: '1px solid var(--card-border)' 
              }}>
                {agent.model || 'Gemini 2.5 Pro'}
              </div>
            </div>

            <div className="mb-5">
              <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>TRIGGER & PROMPT</div>
              {agent.schedule && agent.schedule.trigger && agent.schedule.trigger !== 'None' ? (
                <div style={{ background: 'rgba(245, 158, 11, 0.05)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#f59e0b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>⏰</span> {agent.schedule.trigger}
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--card-border)' }}>
                    "{agent.schedule.prompt}"
                  </p>
                </div>
              ) : (
                <div style={{ background: 'rgba(99, 102, 241, 0.05)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', color: '#6366f1', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>🖱️</span> On-Demand Assistant
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                    Triggered manually by users on-demand to automate discrete workflows accurately.
                  </p>
                </div>
              )}
            </div>
            
            <div className="mb-5">
              <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>INSTRUCTIONS</div>
              <div style={{ background: 'var(--bg-primary)', padding: '0.8rem', borderRadius: '12px', border: '1px solid var(--card-border)', position: 'relative' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent card flipping
                    navigator.clipboard.writeText(agent.instructions);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Copy instructions"
                  className="hover:bg-[rgba(255,255,255,0.05)]"
                >
                  {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
                </button>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: '1.5', whiteSpace: 'pre-wrap', paddingRight: '1.5rem' }}>
                  {agent.instructions}
                </p>
              </div>
            </div>

            {agent.data_stores && agent.data_stores.length > 0 && (
              <div className="mb-5">
                <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>DATA STORES</div>
                <div className="flex flex-wrap gap-1">
                  {agent.data_stores.map((store, idx) => (
                    <span key={idx} className="chip chip-grounding">
                      {store}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {agent.tools && agent.tools.length > 0 && (
              <div className="mb-5">
                <div style={{ fontSize: '0.65rem', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ACTIONS</div>
                <div className="flex flex-wrap gap-1">
                  {agent.tools.map((tool, idx) => (
                    <span key={idx} className="chip chip-action">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div style={{ marginTop: 'auto', paddingTop: '1rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--card-border)' }}>
            Click to flip back
          </div>
        </div>
      </div>
    </div>
  );
}
