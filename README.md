# Agent Architect 🚀

Agent Architect is a premium, modern web application designed for **Gemini Enterprise**. It allows users to select enterprise connectors, configure specific metadata/capabilities, provide optional business context, and generate high-ROI low-code agent blueprints powered by Gemini models on Vertex AI.

---

## 🏗️ Architecture Overview

The project is structured as a monorepo consisting of two main components:

1. **Frontend (`/frontend`)**:
   - A highly responsive **React + Vite** single-page application (SPA).
   - Features rich aesthetics, interactive 3D card flips, glassmorphism design, and support for light/dark mode.
   - Built with modern typography (**Outfit** & **Space Grotesk** from Google Fonts) and curated color palettes.
   
2. **Backend (`/backend`)**:
   - An **Express.js** Node server using ES Modules.
   - Connects to Vertex AI via the new `@google/genai` SDK.
   - Uses **Structured Outputs** (JSON Schema) to guarantee valid JSON agent blueprints from Gemini.
   - Serves the compiled frontend static assets in production mode.

---

## 🔑 Vertex AI Configuration & Gemini 3.5 Setup

### 1. Point to Your Google Cloud Project & Location
The backend initializes the Google GenAI client using Vertex AI. The codebase dynamically resolves the target project and location using environment variables:

* **Project ID**: Resolved via `process.env.GCP_PROJECT` or `process.env.GOOGLE_CLOUD_PROJECT`.
* **Location**: Resolved via `process.env.GCP_LOCATION` (defaults to `us-central1`).

Before starting the application, set these environment variables in your terminal:

```bash
# Linux / macOS
export GCP_PROJECT="your-gcp-project-id"
export GCP_LOCATION="us-central1"

# Windows (Command Prompt)
set GCP_PROJECT=your-gcp-project-id
set GCP_LOCATION=us-central1

# Windows (PowerShell)
$env:GCP_PROJECT="your-gcp-project-id"
$env:GCP_LOCATION="us-central1"
```

### 2. Update Gemini Models
The backend is pre-configured to use **Gemini 3.5** (`gemini-3.5-flash`) to generate blueprints. 

If you want to modify or update the model version:
1. Open [backend/server.js](file:///usr/local/google/home/wdufrin/Documents/Code/low-code%20usecases/backend/server.js).
2. Locate the `ai.models.generateContent` call (near line 323):
   ```javascript
   const response = await ai.models.generateContent({
     model: 'gemini-3.5-flash', // <-- Update the model string here
     contents: prompt,
     config: {
       responseMimeType: 'application/json',
       responseSchema: responseSchema,
       temperature: 0.2,
     }
   });
   ```
3. Change `'gemini-3.5-flash'` to your desired Vertex AI model identifier (e.g. `gemini-3.5-pro` or a newer model version).

---

## 💻 Running Locally

To run the application locally, you will need to authenticate your local session with Google Cloud and start the servers.

### Prerequisites
- **Node.js** (v18 or v20 recommended)
- **Google Cloud SDK (gcloud CLI)** installed.
- A **Google Cloud Project** with the **Vertex AI API** enabled.

### Step 1: Local Google Cloud Authentication (ADC)
You must authorize your local developer environment so the backend can make calls to Vertex AI on your behalf:

1. Authenticate Application Default Credentials (ADC):
   ```bash
   gcloud auth application-default login
   ```
2. Set your active CLI project:
   ```bash
   gcloud config set project your-gcp-project-id
   ```

### Step 2: Start the Servers
You can run the application using the automated monorepo scripts or start the services manually.

#### Method A: Monorepo Orchestration (Recommended)
1. In the **root directory** of the project, install all packages for the monorepo, backend, and frontend:
   ```bash
   npm run install-all
   ```
2. Set your Google Cloud project environment variable:
   ```bash
   export GCP_PROJECT="your-gcp-project-id"
   ```
3. Start both development servers concurrently:
   ```bash
   npm run dev
   ```
   * The **backend** starts on port `3002`.
   * The **frontend** starts on port `5173` (or the next available port) and proxies all `/api` requests to port `3002`.
   * Open `http://localhost:5173` in your browser.

#### Method B: Manual Separate Startup
If you prefer to run frontend and backend in separate terminals:

1. **Terminal 1 (Backend)**:
   ```bash
   cd backend
   npm install
   export GCP_PROJECT="your-gcp-project-id"
   npm start
   ```
   *The backend will listen on `http://localhost:3002`.*

2. **Terminal 2 (Frontend)**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *The frontend dev server will launch on `http://localhost:5173` and proxy requests to the backend.*

---

## 🚀 Cloud Run Deployment

The project includes a `cloudbuild.yaml` file to automate compilation, containerization, and deployment.

### Automated Deployment via Cloud Build
Run the following command from the **root directory** of the project:

```bash
gcloud builds submit --config cloudbuild.yaml
```

#### What this Cloud Build pipeline does:
1. **Frontend Compilation**: Installs dependencies in `/frontend` and builds production-ready static assets using `npm run build` (outputs to `frontend/dist`).
2. **Asset Consolidation**: Copies the built frontend assets to `backend/public/` to be bundled inside the container.
3. **Docker Build**: Builds the container image using the `backend/Dockerfile` with `backend/` as the build context.
4. **Push Image**: Pushes the compiled image to Google Container Registry (GCR).
5. **Deploy to Cloud Run**: Deploys the service named `agent-architect` to the `us-central1` region on Cloud Run, setting it to allow unauthenticated public traffic.
