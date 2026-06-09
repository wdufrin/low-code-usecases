import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3002; // Support Cloud Run port or align with local dev proxy

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Gemini Client with Vertex AI
const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GCP_PROJECT || process.env.GOOGLE_CLOUD_PROJECT || 'ancient-sandbox-322523',
  location: process.env.GCP_LOCATION || 'us-central1', // Standard regional endpoint
});

// Define the schema for the structured output
const agentSchema = {
  type: 'object',
  properties: {
    name: { 
        type: 'string', 
        description: 'A professional, catchy name for the agent.' 
    },
    summary: { 
        type: 'string', 
        description: 'A 1-2 sentence summary of what the agent does.' 
    },
    connectors: {
      type: 'array',
      items: { type: 'string' },
      description: 'The list of connectors this agent utilizes from the selection.'
    },
    model: { 
      type: 'string', 
      enum: [
        'Gemini 2.5 Pro', 
        'Gemini 2.5 Flash', 
        'Gemini 3.5 Flash', 
        'Gemini 3.1 Pro (Preview)'
      ],
      description: 'The recommended model name.' 
    },
    instructions: { 
        type: 'string', 
        description: 'A single, cohesive starter prompt for an Agent Builder Workspace (e.g., "Create an agent that automates X by searching Y..."). It should frame the objective as a command that a user can copy-paste to get started, describing the workflow and grounding sources.' 
    },
    data_stores: {
        type: 'array',
        items: { type: 'string' },
        description: 'Specific data stores or locations for Grounding (e.g., SharePoint technical manuals, Google Drive reports).'
    },
    tools: {
        type: 'array',
        items: { type: 'string' },
        description: 'Actions or custom tools needed for execution (e.g., log ticket REST API, send chat notification callback).'
    },
    schedule: {
        type: 'object',
        properties: {
          trigger: { type: 'string', description: 'The recurring time trigger (e.g., "Daily at 9:00 AM", "Every Monday").' },
          prompt: { type: 'string', description: 'The prompt or task executed when this trigger fires.' }
        },
        description: 'Automated recurring execution setup. OMIT THIS PROPERTY ENTIRELY if the agent is on-demand (not scheduled).'
    },

    difficulty: { 
        type: 'string', 
        description: 'Implementation difficulty: Easy, Medium, or Hard.' 
    }
  },
  required: ['name', 'summary', 'connectors', 'model', 'instructions', 'data_stores', 'tools', 'difficulty']
};

const CONNECTOR_CAPABILITIES = {
  'Box': {
    actions: [
      'Upload file: Uploads a new document or file to a specific folder in Box.',
      'Download file: Downloads a file from Box.',
      'Copy file: Creates a duplicate of a file within a destination folder while leaving the original file unchanged.'
    ],
    search: ['Files', 'Folders', 'Comments', 'Metadata']
  },
  'Confluence Cloud': {
    actions: [
      'Upload attachment: Uploads a file to be attached to a specific page.',
      'Download attachment: Retrieves the actual file content of a specific attachment.',
      'Create page: Creates a new Confluence Cloud page.'
    ],
    search: ['Spaces', 'Pages', 'Blog Posts', 'Attachments']
  },
  'Confluence Data Center': {
    actions: [
      'Download attachment: Download an attachment from a Confluence Data Center page.',
      'Upload attachment: Uploads an attachment to a Confluence Data Center page.'
    ],
    search: ['Spaces', 'Pages', 'Attachments']
  },
  'Dropbox': {
    actions: [
      'Download file: Downloads a file from Dropbox.',
      'Upload file: Uploads a new file to a specified path within a Dropbox account.',
      'Create folder: Creates a folder in Dropbox.',
      'Copy file or folder: Copies a file or folder in Dropbox.'
    ],
    search: ['Files', 'Folders', 'Shared Links']
  },
  'GitHub': {
    actions: [
      'Add comment to a pending review: Add comment to pending review in GitHub.',
      'Add comment to an issue: Add comment to an issue in GitHub.',
      'Create branch: Create a branch in GitHub.',
      'Update pull request: Update a pull request in GitHub.',
      'Merge pull request: Merge a pull request in GitHub.'
    ],
    search: ['Repositories', 'Issues & PRs', 'Wikis', 'Code Search']
  },
  'Jira Cloud': {
    actions: [
      'Upload attachment: Uploads an attachment to an existing issue in Jira Cloud.',
      'Change issue status: Changes a Jira issue\'s status.',
      'Create comment: Creates a comment on a Jira issue.',
      'Update comment: Edits an existing comment.',
      'Create issue: Creates a new Jira issue.',
      'Update issue: Updates an existing issue.'
    ],
    search: ['Projects', 'Issues', 'Comments', 'Custom Fields']
  },
  'Linear': {
    actions: [
      'Create comment: Add a comment to a Linear issue.',
      'Create issue: Create an issue in Linear.',
      'Update issue: Update an issue in Linear.',
      'Create project: Create a new Linear project.',
      'Update project: Update information about a Linear project.'
    ],
    search: ['Projects', 'Issues', 'Cycles']
  },
  'Microsoft OneDrive': {
    actions: [
      'Upload file: Uploads a file to OneDrive.',
      'Download file: Downloads a file from OneDrive.',
      'Create folder: Creates a new folder in OneDrive.',
      'Copy file: Copies a file in OneDrive.'
    ],
    search: ['Files', 'Folders']
  },
  'Outlook': {
    actions: [
      'Download attachment: Downloads an attachment from an email.',
      'Create contact: Creates a new outlook contact.',
      'Update contact: Updates an existing Outlook contact.',
      'Create event: Creates a new event.',
      'Update event: Updates an existing event.',
      'Send mail: Sends an email.'
    ],
    search: ['Emails', 'Calendars', 'Contacts', 'Tasks']
  },
  'Microsoft SharePoint': {
    actions: [
      'Add page: Creates a new page on the SharePoint site.',
      'Check out document: Check out a document from a SharePoint library.',
      'Check in document: Check a document into a SharePoint library.',
      'Rename attachment or document: Rename an attachment or a document in a SharePoint library.',
      'Move attachment or document: Move a document from a SharePoint library to a destination library, folder, or another SharePoint site.',
      'Upload document: Uploads a file to a SharePoint list list.',
      'Download document: Downloads a file attached to a SharePoint list.',
      'Create folder: Creates a new folder.',
      'Add list: Creates a new structured data list.'
    ],
    search: ['Sites', 'Lists', 'Libraries']
  },
  'Microsoft Teams': {
    actions: [
      'Send channel message: Sends a message to a specified channel.',
      'Send chat message: Sends a message in a chat.'
    ],
    search: ['Teams', 'Channels', 'Messages', 'Files']
  },
  'Gmail': {
    actions: [
      'Send message: Sends an email message to a specified recipient.'
    ],
    search: ['Emails', 'Attachments', 'Labels', 'Threads']
  },
  'Google Drive': {
    actions: [
      'Create Folder: Creates a new folder in Google Drive.',
      'Upload File: Uploads a file to Google Drive.',
      'Download File: Downloads a file from Google Drive.'
    ],
    search: ['Docs', 'Sheets', 'Slides', 'Drive Folders']
  },
  'ServiceNow': {
    actions: [
      'Create incident: Creates a new ServiceNow incident.',
      'Update incident: Updates an existing ServiceNow incident.'
    ],
    search: ['Incidents', 'Knowledge Base', 'Service Catalog']
  },
  'Zendesk': {
    actions: [
      'Create ticket: Creates a new ticket in Zendesk.',
      'Update ticket: Updates an existing ticket in Zendesk.',
      'Create category: Creates a new category in Zendesk.',
      'Update post: Updates a post in Zendesk.',
      'Merge tickets: Merges multiple tickets in Zendesk.',
      'Update article: Updates an existing article in Zendesk.'
    ],
    search: ['Tickets', 'Users', 'Articles']
  }
};

const responseSchema = {
  type: 'array',
  items: agentSchema,
  description: 'A list of 5-6 agent use cases.'
};

app.post('/api/generate', async (req, res) => {
  const { connectors, context, disabledCapabilities = {} } = req.body;

  console.log('\n--- API GENERATE REQUEST ---');
  console.log('Connectors:', connectors);
  console.log('Disabled Capabilities:', JSON.stringify(disabledCapabilities, null, 2));

  if (!connectors || !Array.isArray(connectors) || connectors.length === 0) {
    return res.status(400).json({ error: 'Connectors are required' });
  }

  try {
    let contextPrompt = '';
    if (context && typeof context === 'string' && context.trim() !== '') {
      contextPrompt = `
      **USER CONTEXT**:
      The user has provided the following background to tailor these blueprints:
      "${context.trim()}"

      **CRITICAL INSTRUCTION**: You MUST prioritize designing agents that solve the specific goals or enhance workflows described in the user context above responsibly.
      `;
    }

    // Dynamically build the whitelist based on enabled capabilities
    let actionsWhitelistPrompt = '';
    let searchCapabilitiesPrompt = '';

    for (const connector of connectors) {
      const cap = CONNECTOR_CAPABILITIES[connector];
      const disabled = disabledCapabilities[connector] || [];

      if (cap) {
        if (cap.actions) {
          const enabledActions = cap.actions.filter(act => {
            const actName = act.split(':')[0].trim();
            return !disabled.includes(actName);
          });

          if (enabledActions.length > 0) {
            actionsWhitelistPrompt += `\n**${connector}**\n`;
            enabledActions.forEach(act => actionsWhitelistPrompt += `- ${act}\n`);
          }
        }

        if (cap.search) {
          if (Array.isArray(cap.search)) {
            const enabledSearch = cap.search.filter(ent => !disabled.includes(ent));
            if (enabledSearch.length > 0) {
              searchCapabilitiesPrompt += `- **${connector}**: ${enabledSearch.join(', ')}\n`;
            }
          } else {
            if (!disabled.includes('Search Features')) {
              searchCapabilitiesPrompt += `- **${connector}**: ${cap.search}\n`;
            }
          }
        }
      }
    }

    const prompt = `
      You are an expert Enterprise AI solutions architect designing for Gemini Enterprise.
      Generate 5 or 6 low-code agent blueprints that capitalize on the selected tool connectors: ${connectors.join(', ')}.
      
      ${contextPrompt}
      
      **SUPPORTED CONNECTOR ACTIONS WHITELIST**:
      Propose agent actions **ONLY** from the exact supported capabilities listed below for each connector. If an action for a connector is not listed here (or was disabled by user), you CANNOT propose it (it must be read-only/grounding if no mutations list exists). If a connector is not listed here at all, treat it as read-only.
      
      ${actionsWhitelistPrompt}
      
      **SUPPORTED SEARCH/GROUNDING ENTITIES (Capabilities)**:
      When designing agents, assume the following connectors can **ONLY** search for the listed entities. If a connector is not listed here (or has no entities), treat it as standard web search/unstructured text search only (e.g., website or GCS):
      
      ${searchCapabilitiesPrompt}


      **CRITICAL ARCHITECTURE CONSTRAINTS**: 
      1. **Execution model**: You MUST generate exactly 1 or 2 agents that are **On-Demand only** (meaning they OMIT the schedule property object entirely). The rest should be scheduled. If an agent is on-demand, you are forbidden from generating a "schedule" block for it!


      2. **Action strictly alignment limitations**:
         * **STRICT WHITELIST ADHERENCE**: You MUST restrict proposed actions only to items explicitly listed above in the **SUPPORTED CONNECTOR ACTIONS WHITELIST**. If an action is not inside that list, you are forbidden to propose it. Treat other selectors strictly as Read-Only grounding sources contour safely correctly transparently responsibly overlay.
      3. **Instructions Format**: Write the \`instructions\` field as a **single, cohesive starter prompt** for an Agent Builder (e.g., "Create an agent that automates X by searching Y and saving Z. It should follow these steps..."). Start with "Create an agent that..." or "Help me analyze...". Do NOT use numbered lists (1, 2, 3) for instructions - use paragraphs. It should be directly copy-pasteable by the user as a prompt to get started!

      4. **Strict Selector Integrity**: You are STRICTLY FORBIDDEN from proposing actions, data stores, or operational workflows for ANY connector that is not explicitly present in the selected connectors list: [${connectors.join(', ')}]. DO NOT mix up similar tools (e.g., DO NOT propose Outlook actions if Gmail was selected).

      5. **Search/Grounding Alignment**: For the connectors you propose, check the **SUPPORTED SEARCH/GROUNDING ENTITIES** section. If a connector is not listed there (e.g., Notion, Shopify, etc.), consider it **UNSUPPORTED for native search** (it should not be used as a grounding datasource unless custom ingestion like BigQuery/GCS is specified in the context).



      Generate 5-6 structured agent blueprint ideas that adhere strictly to the whitelists and constraints above. Ensure exactly 1 or 2 are on-demand (omit the "schedule" property entirely). The "instructions" field MUST be a single, cohesive starter prompt for a user to get started (e.g., "Create an agent that..."). Do NOT use numbered lists for instructions.

    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash', // Using latest flash model

      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2,

      }
    });

    const text = response.text;
    const agents = JSON.parse(text);
    
    // Failsafe: Programmatically ensure exactly 1-2 agents are on-demand by deleting their schedule
    if (agents.length > 0) delete agents[0].schedule;
    if (agents.length > 1) {
      delete agents[1].schedule; // Make the first two on-demand
    }
    
    res.json(agents);

  } catch (error) {
    console.error('Error generating agents:', error);
    res.status(500).json({ 
      error: 'Failed to generate agent ideas', 
      details: error.message 
    });
  }
});

// Fallback route serving index.html for SPA accurately
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
