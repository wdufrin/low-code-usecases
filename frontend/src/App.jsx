import React, { useState, useEffect } from 'react';
import ConnectorSelector from './components/ConnectorSelector';
import ContextPanel from './components/ContextPanel';
import AgentCard from './components/AgentCard';
import { Sparkles, Loader2, Moon, Sun, Settings } from 'lucide-react';
import { CONNECTOR_LIST } from './components/ConnectorSelector';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [selectedConnectors, setSelectedConnectors] = useState([]);
  const [userContext, setUserContext] = useState('');
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [disabledConnectors, setDisabledConnectors] = useState(() => {
    const saved = localStorage.getItem('disabledConnectors');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleToggleConnector = (connectorName) => {
    setSelectedConnectors(prev => 
      prev.includes(connectorName)
        ? prev.filter(c => c !== connectorName)
        : [...prev, connectorName]
    );
  };

  const generateAgents = async () => {
    if (selectedConnectors.length === 0) {
      setError('Please select at least one connector.');
      return;
    }

    setLoading(true);
    setError(null);
    setAgents([]);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          connectors: selectedConnectors,
          context: userContext 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate agents. Please check if the backend is running.');
      }

      const data = await response.json();
      setAgents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="header" style={{ paddingTop: '1rem', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '1rem', right: '0' }}>
          <button 
            onClick={toggleTheme}
            className="theme-toggle"
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--card-border)',
              padding: '0.6rem',
              borderRadius: '12px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              boxShadow: 'var(--card-shadow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
        <div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.4rem 0.8rem', 
            borderRadius: '9999px', 
            background: 'var(--accent-glow)', 
            border: '1px solid var(--card-border)', 
            marginBottom: '1.5rem' 
          }}>
            <Sparkles size={14} style={{ color: '#6366f1' }} />
            <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#6366f1', letterSpacing: '0.05em' }}>GEMINI ENTERPRISE</span>
          </div>
        </div>
        <h1 className="title-gradient" style={{ 
          fontSize: '3.5rem', 
          fontWeight: '800', 
          marginBottom: '1rem', 
          letterSpacing: '-0.02em'
        }}>
          Agent Architect
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
          Select your enterprise tools and let Gemini reveal the high-ROI agents you can build today in a low-code environment.
        </p>
      </header>

      {/* Connector Selector */}
      <ConnectorSelector 
        selectedConnectors={selectedConnectors} 
        onToggle={handleToggleConnector} 
        theme={theme}
        connectors={CONNECTOR_LIST.filter(c => !disabledConnectors.includes(c.id))}
      />

      {/* Context Panel */}
      <ContextPanel 
        context={userContext} 
        onChange={setUserContext} 
      />

      {/* Action Button */}
      <div className="flex-center" style={{ margin: '3.5rem 0' }}>
        <button
          onClick={generateAgents}
          disabled={loading || selectedConnectors.length === 0}
          className="btn-generate"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <span>Architecting Agents...</span>
            </>
          ) : (
            <>
              <Sparkles size={24} />
              <span>Generate Agent Use Cases</span>
            </>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div style={{ 
          padding: '1rem', 
          borderRadius: '16px', 
          border: '1px solid #fee2e2', 
          background: '#fef2f2', 
          color: '#b91c1c', 
          textAlign: 'center', 
          maxWidth: '450px', 
          margin: '0 auto 2rem auto',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          {error}
        </div>
      )}

      {/* Results Grid */}
      {agents.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingLeft: '0.5rem' }}>
            <div style={{ height: '0.6rem', width: '0.6rem', borderRadius: '50%', background: '#10b981' }}></div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Recommended Agent Blueprints</h2>
          </div>
          
          <div className="agent-grid">
            {agents.map((agent, index) => (
              <AgentCard key={index} agent={agent} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && agents.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-secondary)' }}>
          <p style={{ opacity: 0.7 }}>Select connectors and click generate to see architected results.</p>
        </div>
      )}
      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal 
          disabledConnectors={disabledConnectors}
          onSave={(newDisabled) => {
            setDisabledConnectors(newDisabled);
            localStorage.setItem('disabledConnectors', JSON.stringify(newDisabled));
            setIsSettingsOpen(false);
          }}
          onClose={() => setIsSettingsOpen(false)}
          theme={theme}
        />
      )}

      {/* Floating Settings Button */}
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="settings-toggle"
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          background: 'var(--bg-glass)',
          border: '1px solid var(--card-border)',
          padding: '0.8rem',
          borderRadius: '50%',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          boxShadow: 'var(--card-shadow)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
      >
        <Settings size={28} />
      </button>
    </div>
  );
}
