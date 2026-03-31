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

// eslint-disable-next-line react-refresh/only-export-components
export const CONNECTOR_LIST = [
  // Third Party & Microsoft
  { 
    id: 'github', name: 'GitHub', icon: Github, color: '#24292e',
    syncs: ['Repositories', 'Issues & PRs', 'Wikis', 'Code Search'],
    actions: ['Add comment to a pending review', 'Add comment to an issue', 'Create branch', 'Update pull request', 'Merge pull request'],
    permissions: 'OAuth 2.0 / GitHub App',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/github'
  },
  { 
    id: 'slack', name: 'Slack', icon: MessageSquare, color: '#4A154B',
    syncs: ['Channels', 'Messages', 'Threads', 'Files'],
    actions: [],
    permissions: 'OAuth 2.0 (Bot Token)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/slack'
  },
  { 
    id: 'box', name: 'Box', icon: FolderOpen, color: '#0061d5',
    syncs: ['Files', 'Folders', 'Comments', 'Metadata'],
    actions: ['Upload file', 'Download file', 'Copy file'],
    permissions: 'OAuth 2.0 (User Context)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/box'
  },
  { 
    id: 'jira-cloud', name: 'Jira Cloud', icon: CheckSquare, color: '#0052cc',
    syncs: ['Projects', 'Issues', 'Comments', 'Custom Fields'],
    actions: ['Upload attachment', 'Change issue status', 'Create comment', 'Update comment', 'Create issue', 'Update issue'],
    permissions: 'OAuth 2.0 / Basic Auth',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/jira-cloud'
  },
  { 
    id: 'jira-dc', name: 'Jira Data Center', icon: CheckSquare, color: '#0052cc',
    syncs: ['Projects', 'Issues', 'Comments'],
    actions: ['Create issue', 'Update issue', 'Change Issue Status', 'Create comment', 'Update comment', 'Download attachment', 'Upload attachment'],
    permissions: 'Basic Auth / OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/jira-dc'
  },
  { 
    id: 'confluence-cloud', name: 'Confluence Cloud', icon: FileText, color: '#0052cc',
    syncs: ['Spaces', 'Pages', 'Blog Posts', 'Attachments'],
    actions: ['Upload attachment', 'Download attachment', 'Create page'],
    permissions: 'OAuth 2.0 / Basic Auth',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/confluence-cloud'
  },
  { 
    id: 'confluence-dc', name: 'Confluence Data Center', icon: FileText, color: '#0052cc',
    syncs: ['Spaces', 'Pages', 'Attachments'],
    actions: ['Download attachment', 'Upload attachment'],
    permissions: 'Basic Auth / OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/confluence-dc'
  },
  { 
    id: 'dropbox', name: 'Dropbox', icon: FolderOpen, color: '#0061d5',
    syncs: ['Files', 'Folders', 'Shared Links'],
    actions: ['Download file', 'Upload file', 'Create folder', 'Copy file or folder'],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/dropbox'
  },
  { 
    id: 'linear', name: 'Linear', icon: CheckSquare, color: '#5e6ad2',
    syncs: ['Projects', 'Issues', 'Cycles'],
    actions: ['Create comment', 'Create issue', 'Update issue', 'Create project', 'Update project'],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/linear'
  },
  { 
    id: 'monday', name: 'Monday.com', icon: Calendar, color: '#ff3d57',
    syncs: ['Boards', 'Items', 'Updates', 'Subitems'],
    actions: ['Create workspace'],
    permissions: 'OAuth 2.0 (User Context)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/monday'
  },
  { 
    id: 'hubspot', name: 'HubSpot', icon: Users, color: '#ff7a59',
    syncs: ['Contacts', 'Companies', 'Tickets', 'Deals'],
    actions: [],
    permissions: 'OAuth 2.0 (User Context)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/hubspot'
  },
  { 
    id: 'shopify', name: 'Shopify', icon: ShoppingBag, color: '#96bf48',
    syncs: ['Products', 'Orders', 'Customers', 'Inventory'],
    actions: ['Create customer', 'Update customer', 'Create order', 'Send Fulfillment Request'],
    permissions: 'OAuth 2.0 (Admin API)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/shopify'
  },
  { 
    id: 'notion', name: 'Notion', icon: FileText, color: '#000000',
    syncs: ['Pages', 'Databases', 'Blocks'],
    actions: ['Create database', 'Update database', 'Create page', 'Update page', 'Create comment'],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/notion'
  },
  { 
    id: 'outlook', name: 'Outlook', icon: Mail, color: '#0078d4',
    syncs: ['Emails', 'Calendars', 'Contacts', 'Tasks'],
    actions: ['Download attachment', 'Create contact', 'Update contact', 'Create event', 'Update event', 'Send mail'],
    permissions: 'OAuth 2.0 (Microsoft Graph)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/ms-outlook'
  },
  { 
    id: 'onedrive', name: 'Microsoft OneDrive', icon: FolderOpen, color: '#0078d4',
    syncs: ['Files', 'Folders'],
    actions: ['Upload file', 'Download file', 'Create folder', 'Copy file'],
    permissions: 'OAuth 2.0 (Microsoft Graph)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/ms-onedrive'
  },
  { 
    id: 'sharepoint', name: 'Microsoft SharePoint', icon: FileText, color: '#0078d4',
    syncs: ['Sites', 'Lists', 'Libraries'],
    actions: ['Add page', 'Check out document', 'Check in document', 'Rename attachment or document', 'Move attachment or document', 'Upload document', 'Download document', 'Create folder', 'Add list'],
    permissions: 'OAuth 2.0 (Microsoft Graph)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/ms-sharepoint'
  },
  { 
    id: 'teams', name: 'Microsoft Teams', icon: MessageSquare, color: '#555a99',
    syncs: ['Teams', 'Channels', 'Messages', 'Files'],
    actions: ['Send channel message', 'Send chat message'],
    permissions: 'OAuth 2.0 (Microsoft Graph)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/ms-teams'
  },
  { 
    id: 'servicenow', name: 'ServiceNow', icon: Server, color: '#81b5a1',
    syncs: ['Incidents', 'Knowledge Base', 'Service Catalog'],
    actions: ['Create incident', 'Update incident'],
    permissions: 'OAuth 2.0 / Basic Auth',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/servicenow'
  },
  { 
    id: 'zendesk', name: 'Zendesk', icon: MessageCircle, color: '#03363d',
    syncs: ['Tickets', 'Users', 'Articles'],
    actions: ['Create ticket', 'Update ticket', 'Create category', 'Update post', 'Merge tickets', 'Update article'],
    permissions: 'OAuth 2.0 / Token',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/zendesk'
  },
  
  // Google First Party (Kept as read-only/grounding sources)
  { 
    id: 'drive', name: 'Google Drive', icon: FolderOpen, color: '#f4b400',
    syncs: ['Docs', 'Sheets', 'Slides', 'Drive Folders'],
    actions: ['Create Folder', 'Upload File', 'Download File'],
    permissions: 'OAuth 2.0 (Google Workspace)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/gdrive'
  },
  { 
    id: 'gmail', name: 'Gmail', icon: Mail, color: '#ea4335',
    syncs: ['Emails', 'Attachments', 'Labels', 'Threads'],
    actions: ['Send message'],
    permissions: 'OAuth 2.0 (Google Workspace)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/gmail'
  },
  { 
    id: 'gcal', name: 'Google Calendar', icon: Calendar, color: '#4285f4',
    syncs: ['Events', 'Calendars', 'Attendees', 'Rooms'],
    actions: ['Create Calendar Event', 'Update Calendar Event'],
    permissions: 'OAuth 2.0 (Google Workspace)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/gcal'
  },
  { 
    id: 'gchat', name: 'Google Chat', icon: MessageCircle, color: '#00ac47',
    syncs: ['Spaces', 'Messages', 'Threads', 'Members'],
    actions: ['Send message'],
    permissions: 'OAuth 2.0 (Google Workspace)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/gchat'
  },
  { 
    id: 'bigquery', name: 'BigQuery', icon: Database, color: '#669df6',
    syncs: ['Datasets', 'Tables', 'Views', 'Routines'],
    actions: [],
    permissions: 'OAuth 2.0 (Service Account / User)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-bigquery'
  },
  { 
    id: 'gcs', name: 'Cloud Storage', icon: HardDrive, color: '#4285f4',
    syncs: ['Buckets', 'Objects', 'Metadata'],
    actions: [],
    permissions: 'OAuth 2.0 (Service Account / User)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-cloud-storage'
  },
  { 
    id: 'gsearch', name: 'Google Search', icon: Search, color: '#4285f4',
    syncs: ['Web Pages', 'Knowledge Graph'],
    actions: [],
    permissions: 'API Key / Search Engine ID'
  },
];

export default function ConnectorSelector({ selectedConnectors, onToggle, theme, connectors = CONNECTOR_LIST }) {
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
        {connectors.map((item) => {
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
