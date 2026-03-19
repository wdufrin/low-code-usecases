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
  Search
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
  
  // Google First Party (Selected from Docs)
  { id: 'drive', name: 'Google Drive', icon: FolderOpen, color: '#f4b400' },
  { id: 'gmail', name: 'Gmail', icon: Mail, color: '#ea4335' },
  { id: 'gcal', name: 'Google Calendar', icon: Calendar, color: '#4285f4' },
  { id: 'gchat', name: 'Google Chat', icon: MessageCircle, color: '#00ac47' },
  { id: 'bigquery', name: 'BigQuery', icon: Database, color: '#669df6' },
  { id: 'gcs', name: 'Cloud Storage', icon: HardDrive, color: '#4285f4' },
  { id: 'gsearch', name: 'Google Search', icon: Search, color: '#4285f4' },
];

export default function ConnectorSelector({ selectedConnectors, onToggle }) {
  return (
    <div className="glass p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-purple-400">1. Select Connectors</h2>
      <p className="text-gray-400 text-sm mb-6">Choose the data sources you want your low-code agent to orchestrate.</p>
      
      <div className="connector-grid">
        {CONNECTOR_LIST.map((item) => {
          const Icon = item.icon;
          const isSelected = selectedConnectors.includes(item.name);
          
          return (
            <button
              key={item.id}
              onClick={() => onToggle(item.name)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 border
                ${isSelected 
                  ? 'shadow-lg' 
                  : 'bg-gray-800/40 border-gray-700/50 hover:border-gray-600 hover:bg-gray-800/60'
                }
              `}
              style={isSelected ? {
                backgroundColor: `${item.color}26`, /* 15% fill overlay for professional transparent blend */
                borderColor: item.color,
                borderStyle: 'solid', /* FIX OUTSET BORDER RECTANGLE BUG */
                boxShadow: `0 6px 16px -3px ${item.color}40`
              } : {}}
            >
              <div 
                className={`p-2 rounded-full mb-2 transition-transform duration-150 ${isSelected ? 'scale-110' : ''}`}
              >
                <Icon 
                  size={22} 
                  style={{ 
                    color: isSelected ? item.color : 'var(--text-secondary)',
                    filter: isSelected ? `drop-shadow(0 0 6px ${item.color}66)` : 'none'
                  }} 
                />
              </div>
              <span className={`text-xs ${isSelected ? 'font-semibold text-white' : 'text-gray-400'}`}>
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
