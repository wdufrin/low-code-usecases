import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001; // Support Cloud Run port

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Gemini Client with Vertex AI
// Using the project approved by the user
const ai = new GoogleGenAI({
  vertexai: true,
  project: 'ancient-sandbox-322523',
  location: 'us-central1', // Standard regional endpoint
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
        'Gemini 3 Flash (Preview)', 
        'Gemini 3.1 Pro (Preview)'
      ],
      description: 'The recommended model name.' 
    },
    instructions: { 
        type: 'string', 
        description: 'Operational instructions framed AS A DIRECT PROMPT for an AI Agent Builder Assistant (e.g. "Configure an agent that...", "Ground with X..."). tell the assistant exactly how to set up this agent.' 
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
        description: 'Automated recurring execution setup.'
    },
    difficulty: { 
        type: 'string', 
        description: 'Implementation difficulty: Easy, Medium, or Hard.' 
    }
  },
  required: ['name', 'summary', 'connectors', 'model', 'instructions', 'data_stores', 'tools', 'difficulty']
};

const responseSchema = {
  type: 'array',
  items: agentSchema,
  description: 'A list of 5-6 agent use cases.'
};

app.post('/api/generate', async (req, res) => {
  const { connectors, context } = req.body;

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

    const prompt = `
      You are an expert Enterprise AI solutions architect designing for Gemini Enterprise.
      Generate 5 or 6 low-code agent blueprints that capitalize on the selected tool connectors: ${connectors.join(', ')}.
      
      ${contextPrompt}
      
      **SUPPORTED CONNECTOR ACTIONS WHITELIST**:
      Propose agent actions **ONLY** from the exact supported capabilities listed below for each connector. If an action for a connector is not listed here, you CANNOT propose it (it must be grounding/read-only if no mutations list exists).
      
      **Box**
      - Upload file: Uploads a new document or file to a specific folder in Box.
      - Download file: Downloads a file from Box.
      - Copy file: Creates a duplicate of a file within a destination folder.
      
      **Confluence Cloud**
      - Upload attachment: Uploads a file to be attached to a specific page.
      - Download attachment: Retrieves the actual file content of a specific attachment.
      - Create page: Creates a new Confluence Cloud page.
      
      **Dropbox**
      - Download file: Downloads a file from Dropbox.
      - Upload file: Uploads a new file to a specified path within a Dropbox account.
      - Create folder: Creates a folder in Dropbox.
      - Copy file or folder: Copies a file or folder in Dropbox.
      
      **GitHub**
      - Add comment to a pending review: Add comment to pending review in GitHub.
      - Add comment to an issue: Add comment to an issue in GitHub.
      - Create branch: Create a branch in GitHub.
      - Update pull request: Update a pull request in GitHub.
      - Merge pull request: Merge a pull request in GitHub.
      
      **Jira Cloud / Data Center**
      - Upload attachment: Uploads an attachment to an existing issue.
      - Change issue status: Changes an issue's status.
      - Create comment: Creates a comment on an issue.
      - Update comment: Edits an existing comment.
      - Create issue: Creates a new issue (requires summary, project ID).
      - Update issue: Updates an existing issue (modify summary, description, assignee).
      
      **Linear**
      - Create comment: Add a comment to a Linear issue.
      - Create issue: Create an issue in Linear.
      - Update issue: Update an issue in Linear.
      - Create project: Create a new Linear project.
      - Update project: Update information about a Linear project.
      
      **Microsoft OneDrive**
      - Upload file: Uploads a file to OneDrive.
      - Download file: Downloads a file from OneDrive.
      - Create folder: Creates a new folder in OneDrive.
      - Copy file: Copies a file in OneDrive.
      
      **Microsoft Outlook**
      - Download attachment: Downloads an attachment from an email.
      - Create contact / Update contact: Creates or Updates a contact.
      - Create event / Update event: Creates or Updates a calendar event.
      - Send mail: Sends an email, including attachments.
      
      **Microsoft SharePoint**
      - Add page: Creates a new page on the SharePoint site.
      - Check out / Check in document: Check out/in from library.
      - Rename / Move document: Rename or move document within site.
      - Upload / Download document: Upload or download assets attached.
      
      **Microsoft Teams**
      - Send channel message: Sends a message to a specified channel.
      - Send chat message: Sends a message in a chat.
      
      **Monday**
      - Create workspace: Create a new workspace in Monday.
      
      **Notion**
      - Create / Update database: Create or update database structures.
      - Create / Update page: Create or update rich content pages on workspace.
      
      **ServiceNow**
      - Create / Update incident: Report and track service interruptions or updates accurately.
      
      **Shopify**
      - Create / Update customer: Customer management.
      - Create order: Create new orders securely.
      
      **Zendesk**
      - Create / Update ticket: Ticket updates cleanly.
      - Merge tickets: Merge multiple tickets responsibly.
      
      **CRITICAL ARCHITECTURE CONSTRAINTS**: 
      1. **Execution model**: Low-code agents can be EITHER **automated recurring schedules** (e.g., Daily Leads breakdown) OR **on-demand tools** triggered manually by a user to automate a discrete workflow efficiently. They CANNOT continuous background-monitor (e.g. do not say "Watch inbox"). If an agent is purely on-demand for manual execution, **OMIT the schedule property object entirely**.
      2. **Action strictly alignment limitations**:
         * **STRICT WHITELIST ADHERENCE**: You MUST restrict proposed actions only to items explicitly listed above in the **SUPPORTED CONNECTOR ACTIONS WHITELIST**. If an action is not inside that list, you are forbidden to propose it. Treat other selectors strictly as Read-Only grounding sources contour safely correctly transparently responsibly overlay.
      3. **Instructions Format**: Write the \`instructions\` field explicitly written AS A PROMPT FOR AN AI AGENT BUILDER ASSISTANT to execute. Frame it as a configuration directive (e.g., "Create an agent that automates X...", "Configure this agent with the following step-by-step instructions: 1. Ground with Z...") making it directly copyable into a builder wizard safely cleanly transparently overlay trigger setup framing responsively appropriately.

      Generate blueprints framing accurate constraints conforming supported blueprints segmenting System Instructions, Grounding specs, Action endpoint triggers list transparent fully accurate framing schedule triggers separately correctly responsibly framing safely.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using standard flash for speed and structured output
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    res.json(JSON.parse(text));

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
