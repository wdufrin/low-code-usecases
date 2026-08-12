import React, { useState, useMemo, useCallback, memo } from 'react';
import ConnectorModal from './ConnectorModal';
import { Info } from 'lucide-react';
import { CONNECTOR_LIST } from '../config/connectorsConfig';

const ConnectorButton = memo(function ConnectorButton({ item, isSelected, onToggle, getIconColor, setInfoConnector }) {
  const Icon = item.icon;
  
  return (
    <button
      onClick={() => onToggle(item.name)}
      className={`relative flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-200 border
        ${isSelected 
          ? 'shadow-md' 
          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }
      `}
      style={isSelected ? {
        position: 'relative',
        backgroundColor: `${item.color}22`, 
        borderColor: item.color,
        borderWidth: '2px',
        transform: 'scale(1.02)'
      } : {
        position: 'relative',
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--card-border)'
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          setInfoConnector(item);
        }}
        className="opacity-60 hover:opacity-100 transition-opacity duration-200"
        style={{ 
          color: getIconColor(item, isSelected),
          position: 'absolute',
          top: '6px',
          right: '10px'
        }}
      >
        <Info size={16} />
      </div>
      <div 
        className={`p-2 rounded-xl mb-3 transition-all duration-200 ${isSelected ? 'scale-110' : ''}`}
        style={isSelected ? { background: `${item.color}33` } : {}}
      >
        <Icon 
          size={24} 
          style={{ 
            color: getIconColor(item, isSelected),
            strokeWidth: isSelected ? 2.5 : 2
          }} 
        />
      </div>
      <span style={{ 
        fontSize: '0.75rem', 
        fontWeight: isSelected ? '700' : '500',
        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)'
      }}>
        {item.name}
      </span>
    </button>
  );
});

const ConnectorSelector = memo(function ConnectorSelector({ selectedConnectors, onToggle, theme, connectors = CONNECTOR_LIST, disabledCapabilities, onToggleCapability }) {
  const [infoConnector, setInfoConnector] = useState(null);

  const getIconColor = useCallback((item, isSelected) => {
    if (!isSelected) return '#94a3b8';
    if (theme === 'dark') {
      // Lighten very dark brand colors for night mode
      if (item.color === '#24292e') return '#ffffff'; // GitHub
      if (item.color === '#4A154B') return '#e2addd'; // Slack
      if (item.color === '#555a99') return '#9fa4d9'; // Teams
    }
    return item.color;
  }, [theme]);

  const google1PIds = useMemo(() => [
    'drive', 'gmail', 'gcal', 'gchat', 'bigquery', 'gcs', 'gsearch', 
    'groups', 'notebooklm', 'cloudsql', 'spanner', 'firestore', 'bigtable', 'alloydb'
  ], []);
  const microsoftIds = useMemo(() => ['outlook', 'onedrive', 'sharepoint', 'teams', 'entra-id', 'microsoft-learn'], []);
  const atlassianIds = useMemo(() => ['jira-cloud', 'jira-dc', 'confluence-cloud', 'confluence-dc', 'bitbucket'], []);
  const zohoIds = useMemo(() => ['zohobooks', 'zohodesk', 'zohoprojects'], []);

  const firstPartyConnectors = useMemo(() => connectors.filter(c => google1PIds.includes(c.id)), [connectors, google1PIds]);
  const microsoftConnectors = useMemo(() => connectors.filter(c => microsoftIds.includes(c.id)), [connectors, microsoftIds]);
  const atlassianConnectors = useMemo(() => connectors.filter(c => atlassianIds.includes(c.id)), [connectors, atlassianIds]);
  const zohoConnectors = useMemo(() => connectors.filter(c => zohoIds.includes(c.id)), [connectors, zohoIds]);
  const general3PConnectors = useMemo(() => connectors.filter(
    c => !google1PIds.includes(c.id) && 
         !microsoftIds.includes(c.id) && 
         !atlassianIds.includes(c.id) && 
         !zohoIds.includes(c.id)
  ), [connectors, google1PIds, microsoftIds, atlassianIds, zohoIds]);

  // Helper render now handled by memoized ConnectorButton component

  return (
    <div className="glass p-8 mb-12">
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>1. Select Connectors</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', opacity: 0.8 }}>Choose the enterprise data sources you want the Gemini agent to orchestrate.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {firstPartyConnectors.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '0.8rem', 
              fontWeight: '800', 
              color: 'var(--text-secondary)', 
              letterSpacing: '0.08em', 
              marginBottom: '0.6rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              opacity: 0.8
            }}>
              <span>GOOGLE 1P CONNECTORS</span>
              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--accent-glow)', color: '#6366f1', borderRadius: '6px' }}>{firstPartyConnectors.length}</span>
            </h3>
            <div className="connector-grid">
              {firstPartyConnectors.map((item) => (
                <ConnectorButton
                  key={item.id}
                  item={item}
                  isSelected={selectedConnectors.includes(item.name)}
                  onToggle={onToggle}
                  getIconColor={getIconColor}
                  setInfoConnector={setInfoConnector}
                />
              ))}
            </div>
          </div>
        )}
        
        {microsoftConnectors.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '0.8rem', 
              fontWeight: '800', 
              color: 'var(--text-secondary)', 
              letterSpacing: '0.08em', 
              marginBottom: '0.6rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              opacity: 0.8
            }}>
              <span>MICROSOFT SUITE</span>
              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--accent-glow)', color: '#6366f1', borderRadius: '6px' }}>{microsoftConnectors.length}</span>
            </h3>
            <div className="connector-grid">
              {microsoftConnectors.map((item) => (
                <ConnectorButton
                  key={item.id}
                  item={item}
                  isSelected={selectedConnectors.includes(item.name)}
                  onToggle={onToggle}
                  getIconColor={getIconColor}
                  setInfoConnector={setInfoConnector}
                />
              ))}
            </div>
          </div>
        )}

        {atlassianConnectors.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '0.8rem', 
              fontWeight: '800', 
              color: 'var(--text-secondary)', 
              letterSpacing: '0.08em', 
              marginBottom: '0.6rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              opacity: 0.8
            }}>
              <span>ATLASSIAN SUITE</span>
              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--accent-glow)', color: '#6366f1', borderRadius: '6px' }}>{atlassianConnectors.length}</span>
            </h3>
            <div className="connector-grid">
              {atlassianConnectors.map((item) => (
                <ConnectorButton
                  key={item.id}
                  item={item}
                  isSelected={selectedConnectors.includes(item.name)}
                  onToggle={onToggle}
                  getIconColor={getIconColor}
                  setInfoConnector={setInfoConnector}
                />
              ))}
            </div>
          </div>
        )}

        {zohoConnectors.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '0.8rem', 
              fontWeight: '800', 
              color: 'var(--text-secondary)', 
              letterSpacing: '0.08em', 
              marginBottom: '0.6rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              opacity: 0.8
            }}>
              <span>ZOHO SUITE</span>
              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--accent-glow)', color: '#6366f1', borderRadius: '6px' }}>{zohoConnectors.length}</span>
            </h3>
            <div className="connector-grid">
              {zohoConnectors.map((item) => (
                <ConnectorButton
                  key={item.id}
                  item={item}
                  isSelected={selectedConnectors.includes(item.name)}
                  onToggle={onToggle}
                  getIconColor={getIconColor}
                  setInfoConnector={setInfoConnector}
                />
              ))}
            </div>
          </div>
        )}

        {general3PConnectors.length > 0 && (
          <div>
            <h3 style={{ 
              fontSize: '0.8rem', 
              fontWeight: '800', 
              color: 'var(--text-secondary)', 
              letterSpacing: '0.08em', 
              marginBottom: '0.6rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              opacity: 0.8
            }}>
              <span>OTHER THIRD-PARTY CONNECTORS</span>
              <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'var(--accent-glow)', color: '#6366f1', borderRadius: '6px' }}>{general3PConnectors.length}</span>
            </h3>
            <div className="connector-grid">
              {general3PConnectors.map((item) => (
                <ConnectorButton
                  key={item.id}
                  item={item}
                  isSelected={selectedConnectors.includes(item.name)}
                  onToggle={onToggle}
                  getIconColor={getIconColor}
                  setInfoConnector={setInfoConnector}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <ConnectorModal 
        connector={infoConnector} 
        onClose={() => setInfoConnector(null)} 
        theme={theme}
        disabledCapabilities={disabledCapabilities}
        onToggleCapability={onToggleCapability}
      />

    </div>
  );
});

export default ConnectorSelector;
