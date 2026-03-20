import React, { useState } from 'react';
import ConnectorModal from './ConnectorModal';
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
  Server,
  Info
} from 'lucide-react';

const CONNECTOR_LIST = [
  // Third Party
  { 
    id: 'github', name: 'GitHub', icon: Github, color: '#24292e',
    syncs: ['Repositories', 'Issues & PRs', 'Wikis', 'Code Search'],
    actions: ['Search Repos', 'Read Code', 'Create Issue', 'Merge PR'],
    permissions: 'OAuth 2.0 / GitHub App'
  },
  { 
    id: 'slack', name: 'Slack', icon: MessageSquare, color: '#4A154B',
    syncs: ['Channels', 'Messages', 'Threads', 'Files'],
    actions: ['Send Message', 'Create Channel', 'Search History'],
    permissions: 'OAuth 2.0 (Bot Token)'
  },
  { 
    id: 'box', name: 'Box', icon: FolderOpen, color: '#0061d5',
    syncs: ['Files', 'Folders', 'Comments', 'Metadata'],
    actions: ['Upload File', 'Share Link', 'Search Content'],
    permissions: 'OAuth 2.0 (User Context)'
  },
  { 
    id: 'jira', name: 'Jira', icon: CheckSquare, color: '#0052cc',
    syncs: ['Projects', 'Issues', 'Comments', 'Custom Fields'],
    actions: ['Create Ticket', 'Update Status', 'Assign User'],
    permissions: 'OAuth 2.0 / Basic Auth'
  },
  { 
    id: 'confluence', name: 'Confluence', icon: FileText, color: '#0052cc',
    syncs: ['Spaces', 'Pages', 'Blog Posts', 'Attachments'],
    actions: ['Create Page', 'Update Content', 'Search Wiki'],
    permissions: 'OAuth 2.0 / Basic Auth'
  },
  { 
    id: 'monday', name: 'Monday.com', icon: Calendar, color: '#ff3d57',
    syncs: ['Boards', 'Items', 'Updates', 'Subitems'],
    actions: ['Create Item', 'Change Status', 'Add Update'],
    permissions: 'OAuth 2.0 (User Context)'
  },
  { 
    id: 'hubspot', name: 'HubSpot', icon: Users, color: '#ff7a59',
    syncs: ['Contacts', 'Companies', 'Tickets', 'Deals'],
    actions: ['Create Contact', 'Update Deal', 'Log Activity'],
    permissions: 'OAuth 2.0 (User Context)'
  },
  { 
    id: 'shopify', name: 'Shopify', icon: ShoppingBag, color: '#96bf48',
    syncs: ['Products', 'Orders', 'Customers', 'Inventory'],
    actions: ['Create Order', 'Update Inventory', 'Fetch Customer'],
    permissions: 'OAuth 2.0 (Admin API)'
  },
  { 
    id: 'outlook', name: 'Outlook', icon: Mail, color: '#0078d4',
    syncs: ['Emails', 'Calendars', 'Contacts', 'Tasks'],
    actions: ['Send Email', 'Schedule Event', 'Read Inbox'],
    permissions: 'OAuth 2.0 (Microsoft Graph)'
  },
  { 
    id: 'teams', name: 'MS Teams', icon: MessageSquare, color: '#555a99',
    syncs: ['Teams', 'Channels', 'Messages', 'Files'],
    actions: ['Send Message', 'Create Meeting', 'List Members'],
    permissions: 'OAuth 2.0 (Microsoft Graph)'
  },
  { 
    id: 'servicenow', name: 'ServiceNow', icon: Server, color: '#81b5a1',
    syncs: ['Incidents', 'Knowledge Base', 'Service Catalog'],
    actions: ['Create Incident', 'Resolve Ticket', 'Search KB', 'Approve Request'],
    permissions: 'OAuth 2.0 / Basic Auth'
  },
  
  // Google First Party (Selected from Docs)
  { 
    id: 'drive', name: 'Google Drive', icon: FolderOpen, color: '#f4b400',
    syncs: ['Docs', 'Sheets', 'Slides', 'Drive Folders'],
    actions: ['Create File', 'Share Document', 'Search Drive'],
    permissions: 'OAuth 2.0 (Google Workspace)'
  },
  { 
    id: 'gmail', name: 'Gmail', icon: Mail, color: '#ea4335',
    syncs: ['Emails', 'Attachments', 'Labels', 'Threads'],
    actions: ['Send Email', 'Read Thread', 'Draft Reply'],
    permissions: 'OAuth 2.0 (Google Workspace)'
  },
  { 
    id: 'gcal', name: 'Google Calendar', icon: Calendar, color: '#4285f4',
    syncs: ['Events', 'Calendars', 'Attendees', 'Rooms'],
    actions: ['Create Event', 'Update RSVP', 'Find Free Time'],
    permissions: 'OAuth 2.0 (Google Workspace)'
  },
  { 
    id: 'gchat', name: 'Google Chat', icon: MessageCircle, color: '#00ac47',
    syncs: ['Spaces', 'Messages', 'Threads', 'Members'],
    actions: ['Send Message', 'Read Thread', 'Create Space'],
    permissions: 'OAuth 2.0 (Google Workspace)'
  },
  { 
    id: 'bigquery', name: 'BigQuery', icon: Database, color: '#669df6',
    syncs: ['Datasets', 'Tables', 'Views', 'Routines'],
    actions: ['Run Query', 'Insert Rows', 'List Tables'],
    permissions: 'OAuth 2.0 (Service Account / User)'
  },
  { 
    id: 'gcs', name: 'Cloud Storage', icon: HardDrive, color: '#4285f4',
    syncs: ['Buckets', 'Objects', 'Metadata'],
    actions: ['Upload File', 'Download File', 'List Objects'],
    permissions: 'OAuth 2.0 (Service Account / User)'
  },
  { 
    id: 'gsearch', name: 'Google Search', icon: Search, color: '#4285f4',
    syncs: ['Web Pages', 'Knowledge Graph'],
    actions: ['Search Web', 'Get Snippets', 'Fact Check'],
    permissions: 'API Key / Search Engine ID'
  },
];

export default function ConnectorSelector({ selectedConnectors, onToggle, theme }) {
  const [infoConnector, setInfoConnector] = useState(null);

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
        })}
      </div>
      
      <ConnectorModal 
        connector={infoConnector} 
        onClose={() => setInfoConnector(null)} 
        theme={theme}
      />
    </div>
  );
}
