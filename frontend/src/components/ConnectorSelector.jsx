import React from 'react';
import { 
  Github, 
  MessageSquare, 
  FolderOpen, 
  Calendar, 
  CheckSquare, 
  ShoppingBag, 
  Trello, 
  Database, 
  FileText, 
  Mail, 
  Users,
  HardDrive,
  MessageCircle,
  Search,
  Server
} from 'lucide-react';

const CONNECTOR_LIST = [
  // Third Party
  { id: 'github', name: 'GitHub', icon: Github, color: '#24292e' },
  { id: 'slack', name: 'Slack', icon: MessageSquare, color: '#4A154B' },
  { id: 'box', name: 'Box', icon: FolderOpen, color: '#0061d5' },
  { id: 'jira', name: 'Jira', icon: CheckSquare, color: '#0052cc' },
  { id: 'confluence', name: 'Confluence', icon: FileText, color: '#0052cc' },
  { id: 'monday', name: 'Monday.com', icon: Calendar, color: '#ff3d57' },
  { id: 'hubspot', name: 'HubSpot', icon: Users, color: '#ff7a59' },
  { id: 'shopify', name: 'Shopify', icon: ShoppingBag, color: '#96bf48' },
  { id: 'outlook', name: 'Outlook', icon: Mail, color: '#0078d4' },
  { id: 'teams', name: 'MS Teams', icon: MessageSquare, color: '#555a99' },
  { id: 'servicenow', name: 'ServiceNow', icon: Server, color: '#81b5a1' },
  
  // Google First Party (Selected from Docs)
  { id: 'drive', name: 'Google Drive', icon: FolderOpen, color: '#f4b400' },
  { id: 'gmail', name: 'Gmail', icon: Mail, color: '#ea4335' },
  { id: 'gcal', name: 'Google Calendar', icon: Calendar, color: '#4285f4' },
  { id: 'gchat', name: 'Google Chat', icon: MessageCircle, color: '#00ac47' },
  { id: 'bigquery', name: 'BigQuery', icon: Database, color: '#669df6' },
  { id: 'gcs', name: 'Cloud Storage', icon: HardDrive, color: '#4285f4' },
  { id: 'gsearch', name: 'Google Search', icon: Search, color: '#4285f4' },
];

export default function ConnectorSelector({ selectedConnectors, onToggle, theme }) {
  const getIconColor = (item, isSelected) => {
    if (!isSelected) return '#94a3b8';
    if (theme === 'dark') {
      // Lighten very dark brand colors for night mode
      if (item.color === '#24292e') return '#ffffff'; // GitHub
      if (item.color === '#4A154B') return '#e2addd'; // Slack
      if (item.color === '#555a99') return '#9fa4d9'; // Teams
    }
    return item.color;
  };

  return (
    <div className="glass p-8 mb-12">
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>1. Select Connectors</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', opacity: 0.8 }}>Choose the enterprise data sources you want the Gemini agent to orchestrate.</p>
      
      <div className="connector-grid">
        {CONNECTOR_LIST.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedConnectors.includes(item.name);
          
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.name)}
              className={`flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-200 border
                ${isSelected 
                  ? 'shadow-md' 
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }
              `}
              style={isSelected ? {
                backgroundColor: `${item.color}22`, 
                borderColor: item.color,
                borderWidth: '2px',
                transform: 'scale(1.02)'
              } : {
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--card-border)'
              }}
            >
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
        })}
      </div>
    </div>
  );
}
