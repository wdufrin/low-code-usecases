import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, HelpCircle, Sparkles, Zap, ShieldCheck } from 'lucide-react';

export default function HelpModal({ onClose }) {
  const [activeSection, setActiveSection] = useState('connectors');

  const videoMapping = {
    'connectors': '/walkthrough_connectors.webp',
    'filter': '/walkthrough_filter.webp',
    'context': '/walkthrough_context.webp',
    'generate': '/walkthrough_generate.webp',
    'cards': '/walkthrough_cards.webp',
    'lc': '/walkthrough_lowcode.webp'
  };

  const modalContent = (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 99999, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1rem'
    }}>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease-out'
        }} 
      />

      {/* Modal Card */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '850px', 
        maxHeight: '90vh',
        background: 'var(--bg-glass)', 
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--card-border)', 
        borderRadius: '24px', 
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)', 
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden',
        animation: 'slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1.5rem 2rem', 
          borderBottom: '1px solid var(--card-border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              padding: '0.6rem', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <HelpCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>How to Use Agent Architect</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Discover high-ROI agent ideas in seconds.</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--card-border)', 
              borderRadius: '12px', 
              padding: '0.6rem', 
              cursor: 'pointer', 
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ 
          padding: '2rem', 
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(350px, 400px)',
          gap: '2rem'
        }} className="help-content-grid">
          
          {/* Instructions Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { id: 'connectors', num: '1.', title: 'Select Connectors', desc: 'Choose the enterprise data sources you want the Gemini agent to orchestrate.' },
              { id: 'filter', num: '2.', title: 'Filter Capabilities (Optional)', desc: 'Click the Info icon on a connector to disable specific actions or sync features.' },
              { id: 'context', num: '3.', title: 'Describe Your Context (Optional)', desc: 'Provide details about your role, industry, or specific problems you want to solve.' },
              { id: 'generate', num: '4.', title: 'Architect Blueprints', desc: 'Click \'Generate Agent Use Cases\' to see stunning blueprints ready for development.' },
              { id: 'cards', num: '5.', title: 'Flip and Review Starter Prompts', desc: 'Flip card to review technical specifications and copy the cohesive starter prompt.' }
            ].map(sec => (
              <div 
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                id={`section-${sec.id}`}
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  padding: '0.75rem',
                  alignItems: 'flex-start',
                  borderRadius: '16px',

                  background: activeSection === sec.id ? 'rgba(255,255,255,0.03)' : 'transparent',
                  border: `1px solid ${activeSection === sec.id ? 'rgba(99, 102, 241, 0.3)' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontWeight: '800', fontSize: '1.25rem', color: sec.id === 'connectors' ? '#6366f1' : sec.id === 'filter' ? '#a855f7' : sec.id === 'context' ? '#ec4899' : sec.id === 'generate' ? '#f59e0b' : '#10b981' }}>{sec.num}</div>
                <div>
                  <h4 style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem', marginTop: 0 }}>{sec.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{sec.desc}</p>
                </div>

              </div>
            ))}

            {/* Low-Code Ready */}
            <div 
              onClick={() => setActiveSection('lc')}
              style={{ 
                marginTop: 'auto',
                padding: '1rem', 
                borderRadius: '16px', 
                background: activeSection === 'lc' ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
                border: `1px solid ${activeSection === 'lc' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(99, 102, 241, 0.2)'}`,
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Sparkles size={18} style={{ color: '#6366f1', marginTop: '0.2rem' }} />
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }}>Low-Code Ready</span>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Generated blueprints can be used to start your Agent in Agent Builder by pasting the starter prompt into the agent builder assistant.</p>
              </div>
            </div>
          </div>


          {/* Video Walkthrough Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              background: '#0a0a0c', 
              borderRadius: '16px', 
              border: '1px solid var(--card-border)', 
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              height: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src={`${videoMapping[activeSection]}?v=3`} 
                alt="Walkthrough Video" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }} 
              />


            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                Walkthrough: Selecting connectors, providing context, and generating use cases.
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.getElementById('root') || document.body);
}
