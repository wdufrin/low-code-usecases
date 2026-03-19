import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

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
        description: 'Detailed step-by-step operational instructions for the agent.' 
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
  required: ['name', 'summary', 'connectors', 'model', 'instructions', 'data_stores', 'tools', 'schedule', 'difficulty']
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
      
      **CRITICAL ARCHITECTURE CONSTRAINTS**: 
      1. **Execution model**: Low-code agents **CANNOT** continuous background-monitor or background-process real-time listeners (e.g. do not say "Watch inbox"). They are trigger/schedule based (e.g., "Run Daily at 9:00 AM to qualify leads").
      2. **Action strictly alignment limitations**:
         * **Grounding-ONLY (Ingestion/Federation with NO mutation)**: HubSpot, Box, Dropbox, Linear, Notion. For these tools, the agent CANNOT create, update, or mutate data list items (e.g., absolutely DO NOT say "Create a deal in HubSpot"). They can only **Search/Read** as a GROUNDING context datastore safely transparent cleanly overlay framing setup.
         * **Mutation Allowed (Endpoint Action support)**: GitHub (comment, merge, branch), Jira (create/update issue), Outlook (send mail, create contact), OneDrive/SharePoint (upload/download file, create folder), MS Teams (send message), Monday (create workspace), Shopify (create order), ServiceNow/Zendesk (incident/tickets).
      
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

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
