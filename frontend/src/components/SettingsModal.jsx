import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings, Check, Square } from 'lucide-react';
import { CONNECTOR_LIST } from './ConnectorSelector';

const ConnectorToggleItem = React.memo(({ connector, isDisabled, onToggle }) => {
  const Icon = connector.icon;
  return (
    <div 
      onClick={() => onToggle(connector.id)}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '1rem', 
        borderRadius: '16px', 
        border: '1px solid var(--card-border)', 
        background: 'rgba(255,255,255,0.01)', 
        cursor: 'pointer', 
        transition: 'all 0.2s' 
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          padding: '0.5rem', 
          borderRadius: '12px', 
          background: `${connector.color}22`, 
          color: connector.color 
        }}>
          <Icon size={20} />
        </div>
        <div>
          <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{connector.name}</span>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
            {connector.permissions}
          </div>
        </div>
      </div>
      
      <div style={{
        position: 'relative',
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: isDisabled ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        transition: 'all 0.3s'
      }}>
        <div style={{
          position: 'absolute',
          top: '2px',
          left: '2px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          transform: isDisabled ? 'translateX(0)' : 'translateX(20px)',
          transition: 'transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        }} />
      </div>
    </div>
  );
});

export default function SettingsModal({ disabledConnectors, onSave, onClose }) {
  const [localDisabled, setLocalDisabled] = useState([...disabledConnectors]);

  const toggleConnector = useCallback((id) => {
    setLocalDisabled(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const handleSave = () => {
    onSave(localDisabled);
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
      justifyContent: 'center' 
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
          background: 'rgba(0,0,0,0.6)', 
          backdropFilter: 'blur(8px)' 
        }} 
      />

      {/* Modal Container */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '550px', 
        maxHeight: '80vh', 
        background: 'var(--bg-glass)', 
        backdropFilter: 'blur(20px)', 
        border: '1px solid var(--card-border)', 
        borderRadius: '24px', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden', 
        animation: 'modalSlideUp 0.3s ease-out' 
      }}>
        {/* Header */}
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid var(--card-border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          background: 'rgba(255,255,255,0.02)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              padding: '0.5rem', 
              borderRadius: '12px', 
              background: 'var(--accent-glow)', 
              color: '#6366f1' 
            }}>
              <Settings size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Workspace Settings</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Configure visible connectors</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'transparent', 
              border: 'none', 
              cursor: 'pointer', 
              color: 'var(--text-secondary)', 
              padding: '0.5rem', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              transition: 'all 0.2s' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div style={{ 
          padding: '1.5rem', 
          overflowY: 'auto', 
          flex: 1 
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {CONNECTOR_LIST.map((connector) => (
              <ConnectorToggleItem 
                key={connector.id}
                connector={connector}
                isDisabled={localDisabled.includes(connector.id)}
                onToggle={toggleConnector}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '1.5rem', 
          borderTop: '1px solid var(--card-border)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end', 
          gap: '1rem',
          background: 'rgba(255,255,255,0.02)' 
        }}>
          <button 
            onClick={onClose} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '12px', 
              border: '1px solid var(--card-border)', 
              background: 'transparent', 
              color: 'var(--text-primary)', 
              cursor: 'pointer', 
              fontWeight: '600', 
              transition: 'all 0.2s' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              borderRadius: '12px', 
              border: 'none', 
              background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', 
              color: '#ffffff', 
              cursor: 'pointer', 
              fontWeight: '600', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
              transition: 'all 0.2s' 
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
