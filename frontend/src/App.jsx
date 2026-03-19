import React, { useState } from 'react';
import ConnectorSelector from './components/ConnectorSelector';
import AgentCard from './components/AgentCard';
import { Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [selectedConnectors, setSelectedConnectors] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const response = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ connectors: selectedConnectors }),
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
      <header className="header">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.8rem', borderRadius: '9999px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '1rem' }}>
          <Sparkles className="text-purple-400" size={16} />
          <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#a78bfa' }}>GEMINI ENTERPRISE</span>
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 'bold', marginBottom: '1rem', background: 'linear-gradient(to right, #a78bfa, #ec4899, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Agent Architect
        </h1>
        <p style={{ color: '#9ca3af', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          Select your enterprise tools and let Gemini reveal the high-ROI agents you can build today in a low-code environment.
        </p>
      </header>

      {/* Connector Selector */}
      <ConnectorSelector 
        selectedConnectors={selectedConnectors} 
        onToggle={handleToggleConnector} 
      />

      {/* Action Button */}
      <div className="flex-center" style={{ margin: '3rem 0' }}>
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
        <div className="glass" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.5)', background: 'rgba(127, 29, 29, 0.1)', color: '#f87171', textAlign: 'center', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
          {error}
        </div>
      )}

      {/* Results Grid */}
      {agents.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <div style={{ height: '0.5rem', width: '0.5rem', borderRadius: '50%', background: '#4ade80' }}></div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#e5e7eb' }}>Generated Agent Blueprints</h2>
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
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#6b7280' }}>
          <p>Select connectors and click generate to see results.</p>
        </div>
      )}
    </div>
  );
}
