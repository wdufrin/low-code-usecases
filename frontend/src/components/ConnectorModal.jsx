import React from 'react';
import { X, ExternalLink, Activity, Database, Shield } from 'lucide-react';

import { createPortal } from 'react-dom';

export default function ConnectorModal({ connector, onClose, theme }) {
  if (!connector) return null;

  const Icon = connector.icon;

  const getAdaptedColor = (hex) => {
    if (theme === 'dark') {
      if (hex === '#24292e') return '#ffffff'; // GitHub lighter
      if (hex === '#4A154B') return '#e2addd'; // Slack lighter
      if (hex === '#555a99') return '#9fa4d9'; // MS Teams lighter
      if (hex === '#000000') return '#ffffff'; // Notion white
    }
    return hex;
  };

  const adaptedColor = getAdaptedColor(connector.color);
  const bgOpacityColor = `${connector.color}22`; // Keep original hex for background opacity so it stays subtle 
  
  const modalContent = (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, display: 'flex' }}>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{ 
          position: 'absolute', 
          top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.6)', 
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
      />
      
      {/* Slide-over Panel */}
      <div 
        className="glass"
        style={{
          position: 'relative',
          width: '450px',
          maxWidth: '85vw',
          height: '100%',
          background: 'var(--bg-primary)',
          borderRight: '1px solid var(--card-border)',
          boxShadow: '25px 0 50px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header Ribbon */}
        <div style={{ height: '6px', background: adaptedColor, width: '100%', flexShrink: 0 }} />

        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{ 
            position: 'absolute', 
            top: '1rem', 
            right: '1rem', 
            padding: '0.5rem', 
            borderRadius: '50%',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <X size={20} />
        </button>

        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '16px', background: bgOpacityColor }}>
              <Icon size={32} style={{ color: adaptedColor }} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                {connector.name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  Federated Data Source
                </span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Syncs */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Database size={16} style={{ color: 'var(--text-secondary)' }} />
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                  DATA FEDERATION (SYNCS)
                </h4>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {connector.syncs?.map((item, i) => (
                  <span 
                    key={i} 
                    style={{ 
                      padding: '0.375rem 0.75rem', 
                      borderRadius: '8px', 
                      border: '1px solid var(--card-border)',
                      fontSize: '0.85rem', 
                      background: 'var(--bg-secondary)', 
                      color: 'var(--text-primary)',
                      fontWeight: '500'
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            {connector.actions && connector.actions.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Activity size={16} style={{ color: 'var(--text-secondary)' }} />
                  <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                    SUPPORTED ACTIONS
                  </h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {connector.actions.map((item, i) => (
                    <span 
                      key={i} 
                      style={{ 
                        padding: '0.375rem 0.75rem', 
                        borderRadius: '8px', 
                        border: `1px solid ${bgOpacityColor}`,
                        fontSize: '0.85rem', 
                        background: bgOpacityColor, 
                        color: adaptedColor,
                        fontWeight: '600'
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Shield size={16} style={{ color: 'var(--text-secondary)' }} />
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                  ACCESS & PERMISSIONS
                </h4>
              </div>
              <div style={{ 
                padding: '0.75rem 1rem', 
                borderRadius: '12px', 
                border: '1px solid var(--card-border)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                background: 'var(--bg-secondary)'
              }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                  {connector.permissions}
                </span>
                <span style={{ padding: '0.125rem 0.5rem', background: 'var(--accent-glow)', color: '#6366f1', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                  Enforced
                </span>
              </div>
            </div>
          </div>
          
          {/* Footer Action */}
          <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)', display: 'flex', justifyContent: 'flex-start' }}>
            <a 
              href={connector.docLink || '#'} 
              target={connector.docLink ? '_blank' : undefined}
              rel={connector.docLink ? 'noopener noreferrer' : undefined}
              onClick={connector.docLink ? undefined : (e) => e.preventDefault()}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.625rem 1.25rem', 
                borderRadius: '12px', 
                background: adaptedColor, 
                color: adaptedColor === '#ffffff' ? '#000' : '#fff', 
                fontSize: '0.9rem', 
                fontWeight: '600',
                textDecoration: 'none',
                boxShadow: `0 4px 14px 0 ${bgOpacityColor}`,
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              View Documentation <ExternalLink size={16} />
            </a>
          </div>

        </div>
      </div>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );

  return createPortal(modalContent, document.body);
}
