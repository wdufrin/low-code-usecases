import React, { useState, useMemo, useCallback, memo } from 'react';
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
  Info,
  Activity,
  CreditCard,
  HelpCircle,
  BookOpen,
  Briefcase,
  Cloud
} from 'lucide-react';


// eslint-disable-next-line react-refresh/only-export-components
export const CONNECTOR_LIST = [
  // Third Party & Microsoft
  { 
    id: 'github', name: 'GitHub', icon: Github, color: '#24292e',
    syncs: ['Repositories', 'Issues & PRs', 'Wikis', 'Code Search'],
    actions: ['Create or update file', 'Create or update issue', 'Fork repository', 'Push files', 'Add comment to a pending review', 'Add comment to an issue', 'Create branch', 'Update pull request', 'Merge pull request'],
    permissions: 'OAuth 2.0 / GitHub App',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/github'
  },
  { 
    id: 'slack', name: 'Slack', icon: MessageSquare, color: '#4A154B',
    syncs: ['Channels', 'Messages', 'Threads', 'Files'],
    actions: ['Send Slack message', 'Schedule Slack message', 'Create Slack canvas', 'Send Slack message draft'],
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
    actions: ['Save comment', 'Save issue', 'Save a project'],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/linear'
  },
  { 
    id: 'monday', name: 'Monday.com', icon: Calendar, color: '#ff3d57',
    syncs: ['Boards', 'Items', 'Updates', 'Subitems'],
    actions: ['Change item column values', 'Create board', 'Create column', 'Create dashboard', 'Create doc', 'Create form', 'Create group', 'Create item', 'Create workspace'],
    permissions: 'OAuth 2.0 (User Context)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/monday'
  },
  { 
    id: 'hubspot', name: 'HubSpot', icon: Users, color: '#ff7a59',
    syncs: ['Contacts', 'Companies', 'Tickets', 'Deals'],
    actions: ['Manage CRM Objects'],
    permissions: 'OAuth 2.0 (User Context)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/hubspot'
  },
  { 
    id: 'shopify', name: 'Shopify', icon: ShoppingBag, color: '#96bf48',
    syncs: ['Products', 'Orders', 'Customers', 'Inventory'],
    actions: ['Create order', 'Send fulfillment request', 'Create customer', 'Update customer'],
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
    actions: ['Update article', 'Update ticket', 'Create category', 'Update post', 'Merge tickets', 'Create ticket'],
    permissions: 'OAuth 2.0 / Token',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/zendesk'
  },
  { 
    id: 'entra-id', name: 'Microsoft Entra ID', icon: Users, color: '#0078d4',
    syncs: ['Users', 'Groups', 'Devices', 'Applications'],
    actions: [],
    permissions: 'OAuth 2.0 (Microsoft Graph)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/entra-id/connect-entra-id'
  },
  { 
    id: 'asana', name: 'Asana', icon: CheckSquare, color: '#fc636b',
    syncs: ['Projects', 'Tasks', 'Sections', 'Workspaces'],
    actions: ['Create project', 'Create project status update', 'Create tasks', 'Update tasks', 'Delete task'],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/asana'
  },
  { 
    id: 'pagerduty', name: 'PagerDuty', icon: Activity, color: '#06ac38',
    syncs: ['Incidents', 'Services', 'Users', 'Schedules', 'Log Entries'],
    actions: ['Create incident', 'Update incident', 'Add note to incident', 'Create service', 'Update service', 'Create user', 'Update user', 'Create on-call override', 'Search', 'List on-call entries', 'List log entries'],
    permissions: 'OAuth 2.0 / Token',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/pagerduty'
  },
  { 
    id: 'wrike', name: 'Wrike', icon: FileText, color: '#04a85b',
    syncs: ['Folders', 'Projects', 'Tasks', 'Spaces'],
    actions: ['Create folder/project'],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/wrike'
  },
  { 
    id: 'zohobooks', name: 'Zoho Books', icon: CreditCard, color: '#e2231a',
    syncs: ['Contacts', 'Invoices', 'Estimates', 'Items', 'Purchase Orders', 'Sales Orders'],
    actions: ['Create Contact', 'Create Customer Payment', 'Create Estimate', 'Create Invoice', 'Create Item', 'Create Purchase Order', 'Create Sales Order', 'Create Tax', 'Update Contact', 'Update Estimate', 'Update Invoice', 'Update Item', 'Update Purchase Order', 'Update Sales Order'],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/zohobooks'
  },
  { 
    id: 'zohodesk', name: 'Zoho Desk', icon: HelpCircle, color: '#2277bb',
    syncs: ['Tickets', 'Events', 'Tasks', 'Comments', 'Contacts'],
    actions: ['Create Event', 'Create Task', 'Create Ticket', 'Create Ticket Comment', 'Mark Ticket As Read', 'Update Ticket'],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/zohodesk'
  },
  { 
    id: 'zohoprojects', name: 'Zoho Projects', icon: Briefcase, color: '#f39200',
    syncs: ['Projects', 'Tasks', 'Milestones', 'Task Lists', 'Issues', 'Phases'],
    actions: ['Create project', 'Create task', 'Create task list', 'Update issue', 'Update phase', 'Update task', 'Update task list'],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/zohoprojects'
  },
  {
    id: 'apollo-graphos', name: 'Apollo GraphOS', icon: Database, color: '#e535ab',
    syncs: ['Graphs', 'Schemas', 'Metrics'],
    actions: [],
    permissions: 'API Key / OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/apollo-graphos'
  },
  {
    id: 'blockscout', name: 'Blockscout', icon: Database, color: '#3c3c3d',
    syncs: ['Blocks', 'Transactions', 'Contracts'],
    actions: [],
    permissions: 'API Key',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/blockscout'
  },
  {
    id: 'dice', name: 'Dice', icon: Search, color: '#1a5ba8',
    syncs: ['Jobs', 'Profiles', 'Applications'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/dice'
  },
  {
    id: 'clinicaltrials', name: 'Clinical Trials', icon: Activity, color: '#007bbf',
    syncs: ['Studies', 'Protocols', 'Results'],
    actions: [],
    permissions: 'API Key',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/clinicaltrials'
  },
  {
    id: 'crossbeam', name: 'Crossbeam', icon: Users, color: '#ff5a5f',
    syncs: ['Partners', 'Overlaps', 'Accounts'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/crossbeam'
  },
  {
    id: 'crypto', name: 'Crypto', icon: CreditCard, color: '#f7931a',
    syncs: ['Tokens', 'Markets', 'Wallets'],
    actions: [],
    permissions: 'API Key',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/crypto'
  },
  {
    id: 'docusign', name: 'DocuSign', icon: FileText, color: '#ffb500',
    syncs: ['Envelopes', 'Templates', 'Documents'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/docusign'
  },
  {
    id: 'excalidraw', name: 'Excalidraw', icon: FileText, color: '#6965db',
    syncs: ['Drawings', 'Libraries', 'Scenes'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/excalidraw'
  },
  {
    id: 'granted', name: 'Granted', icon: Server, color: '#2563eb',
    syncs: ['Permissions', 'Roles', 'Access Logs'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/granted'
  },
  {
    id: 'godaddy', name: 'GoDaddy', icon: Server, color: '#00a650',
    syncs: ['Domains', 'Certificates', 'DNS Records'],
    actions: [],
    permissions: 'API Key',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/godaddy'
  },
  {
    id: 'huggingface', name: 'Hugging Face', icon: Database, color: '#ffd21e',
    syncs: ['Models', 'Datasets', 'Spaces'],
    actions: [],
    permissions: 'API Key / Token',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/huggingface'
  },
  {
    id: 'invideo', name: 'Invideo', icon: FileText, color: '#0052cc',
    syncs: ['Videos', 'Templates', 'Projects'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/invideo'
  },
  {
    id: 'kiwi', name: 'Kiwi', icon: Calendar, color: '#00a699',
    syncs: ['Flights', 'Bookings', 'Destinations'],
    actions: [],
    permissions: 'API Key',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/kiwi'
  },
  {
    id: 'lastminute', name: 'LastMinute', icon: Calendar, color: '#ff4f00',
    syncs: ['Hotels', 'Flights', 'Packages'],
    actions: [],
    permissions: 'API Key',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/lastminute'
  },
  {
    id: 'mermaid_chart', name: 'Mermaid Chart', icon: FileText, color: '#ff3366',
    syncs: ['Diagrams', 'Documents', 'Teams'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/mermaid_chart'
  },
  {
    id: 'midpage', name: 'Midpage', icon: FileText, color: '#6200ee',
    syncs: ['Legal Docs', 'Cases', 'Briefs'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/midpage'
  },
  {
    id: 'microsoft-learn', name: 'Microsoft Learn', icon: BookOpen, color: '#00a4ef',
    syncs: ['Modules', 'Paths', 'Certifications'],
    actions: [],
    permissions: 'Public Access / API',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/microsoft-learn'
  },
  {
    id: 'open_targets', name: 'Open Targets', icon: Activity, color: '#3f51b5',
    syncs: ['Targets', 'Diseases', 'Drugs'],
    actions: [],
    permissions: 'Public Access / API',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/open_targets'
  },
  {
    id: 'pandadoc', name: 'PandaDoc', icon: FileText, color: '#00d084',
    syncs: ['Documents', 'Templates', 'Forms'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/pandadoc'
  },
  {
    id: 'smartsheet', name: 'Smartsheet', icon: FileText, color: '#24a148',
    syncs: ['Sheets', 'Reports', 'Dashboards', 'Workspaces'],
    actions: [],
    permissions: 'OAuth 2.0',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/smartsheet'
  },
  {
    id: 'trivago', name: 'Trivago', icon: Search, color: '#007faf',
    syncs: ['Hotels', 'Deals', 'Reviews'],
    actions: [],
    permissions: 'API Key',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/trivago'
  },
  {
    id: 'salesforce', name: 'Salesforce', icon: Cloud, color: '#00a1e0',
    syncs: ['Accounts', 'Contacts', 'Opportunities', 'Leads', 'Cases'],
    actions: [],
    permissions: 'OAuth 2.0 (User Context / Ingestion)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/salesforce/connect-salesforce'
  },

  // Google First Party (Kept as read-only/grounding sources unless actions exist)
  { 
    id: 'drive', name: 'Google Drive', icon: FolderOpen, color: '#f4b400',
    syncs: ['Docs', 'Sheets', 'Slides', 'Drive Folders'],
    actions: ['Create folder', 'Copy file or folder', 'Download file', 'Upload file'],
    permissions: 'OAuth 2.0 (Google Workspace)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/gdrive'
  },
  { 
    id: 'gmail', name: 'Gmail', icon: Mail, color: '#ea4335',
    syncs: ['Emails', 'Attachments', 'Labels', 'Threads'],
    actions: ['Create label', 'Add label to message', 'Send message', 'Download attachment', 'Send message with attachments'],
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
    actions: ['Create space', 'Reply to thread'],
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
  {
    id: 'groups', name: 'Google Groups', icon: Users, color: '#1a73e8',
    syncs: ['Groups', 'Members', 'Conversations'],
    actions: [],
    permissions: 'OAuth 2.0 (Google Workspace)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-groups'
  },
  {
    id: 'notebooklm', name: 'NotebookLM', icon: BookOpen, color: '#0f9d58',
    syncs: ['Notebooks', 'Notes', 'Sources'],
    actions: [],
    permissions: 'OAuth 2.0 (Google Workspace)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-notebooklm'
  },
  {
    id: 'cloudsql', name: 'Cloud SQL', icon: Database, color: '#4285f4',
    syncs: ['Databases', 'Tables', 'Schemas'],
    actions: [],
    permissions: 'OAuth 2.0 (Service Account / User)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-cloud-sql'
  },
  {
    id: 'spanner', name: 'Spanner', icon: Database, color: '#4285f4',
    syncs: ['Databases', 'Tables', 'Schemas'],
    actions: [],
    permissions: 'OAuth 2.0 (Service Account / User)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-spanner'
  },
  {
    id: 'firestore', name: 'Firestore', icon: Database, color: '#ffca28',
    syncs: ['Collections', 'Documents'],
    actions: [],
    permissions: 'OAuth 2.0 (Service Account / User)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-firestore'
  },
  {
    id: 'bigtable', name: 'Bigtable', icon: Database, color: '#4285f4',
    syncs: ['Instances', 'Tables', 'Rows'],
    actions: [],
    permissions: 'OAuth 2.0 (Service Account / User)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-bigtable'
  },
  {
    id: 'alloydb', name: 'AlloyDB', icon: Database, color: '#4285f4',
    syncs: ['Databases', 'Tables', 'Schemas'],
    actions: [],
    permissions: 'OAuth 2.0 (Service Account / User)',
    docLink: 'https://docs.cloud.google.com/gemini/enterprise/docs/connectors/connect-alloydb'
  }
];

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
  const atlassianIds = useMemo(() => ['jira-cloud', 'jira-dc', 'confluence-cloud', 'confluence-dc'], []);
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
