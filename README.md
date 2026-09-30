# Agentic Task Planner & Executor

An autonomous AI agent interface simulating **LangGraph** workflows for high-level goal decomposition, feasibility validation, actionable step execution, and agentic reflection. Built as a full-stack application using **Google Gemini 3.8 Flash**, **Express**, **React**, and **Tailwind CSS**.

---

## Features

- **LangGraph-Inspired Agent Workflow**:
  1. **Planning**: Decomposes abstract, high-level user goals into structured, logical, and sequential tasks.
  2. **Feasibility Validation**: Validates whether the plan is realistic given constraints and dependencies.
  3. **Execution**: Formulates concrete, actionable steps with estimated completion times and required resources/tools.
  4. **Agent Reflection**: Provides critical self-evaluation, edge-case analysis, and strategic recommendations for execution.
- **Full-Stack Architecture**: Server-side Gemini API execution via an Express backend (`server.ts`) proxying requests from the client.
- **Deterministic Structured JSON**: Strict JSON schema enforcement with `@google/genai` ensures consistent and reliable responses.
- **Interactive UI**: Real-time state progress indicators, interactive goal examples, and clean, responsive card layouts.

---

## Prerequisites

- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## Quick Start (Local Setup)

### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd agentic-task-planner
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create your `.env` file from the provided `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

> **Where to get an API key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to generate an API key.

### 4. Run the Development Server

Start the unified development server (Express backend + Vite middleware on port 3000):

```bash
npm run dev
```

Open your browser at:
```
http://localhost:3000
```

---

## NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the full-stack Express server with Vite in development mode (`port 3000`) |
| `npm run build` | Builds the client-side React SPA for production into `dist/` |
| `npm run start` | Runs the full-stack server in production mode serving the compiled `dist/` assets |
| `npm run lint` | Runs TypeScript type checking (`tsc --noEmit`) |

---

## Production Deployment

To test a production build locally:

```bash
# 1. Build client bundle
npm run build

# 2. Launch production server
NODE_ENV=production npm run start
```

---

## API Reference

### `POST /api/plan`

Executes the agentic task decomposition and reflection pipeline.

**Request Body:**
```json
{
  "goal": "Plan a 6-week residential kitchen remodeling project from demolition to inspection"
}
```

**Response Body:**
```json
{
  "goal": "Plan a 6-week residential kitchen remodeling project from demolition to inspection",
  "plan": [
    {
      "step": 1,
      "task": "Finalize layout design, permit applications, and structural contractor bids",
      "time_required": "1 week",
      "resources": ["City Building Permits", "Architectural Drawings", "Licensed General Contractor"]
    }
  ],
  "validation": {
    "feasible": true,
    "notes": "Feasible assuming building permits and cabinet lead times are scheduled in advance."
  },
  "execution_notes": "Establish a temporary cooking station and protect flooring adjacent to the work area.",
  "reflection": "Long lead times on custom countertops and appliances may cause schedule bottlenecks; order early."
}
```

---

## Project Structure

```
├── App.tsx                     # Main React application view & state machine
├── components/
│   └── AgentDashboard.tsx      # Visual agent state dashboard & step renderer
├── services/
│   └── geminiService.ts        # Client API service communicating with /api/plan
├── server.ts                   # Express server with Gemini SDK integration
├── types.ts                    # TypeScript types & interfaces
├── index.html                  # HTML entry point with Tailwind CDN & FontAwesome
├── index.tsx                   # React DOM root render
├── metadata.json               # Application capabilities configuration
├── package.json                # Project dependencies & npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite server configuration
```

---

## Troubleshooting

- **"API key is missing"**: Ensure that `GEMINI_API_KEY` is defined in your `.env` file and that you restarted the development server.
- **Port 3000 in use**: Set `PORT=3001` (or another port) in your `.env` file.
- **Node version warnings**: Verify you are running Node.js `>= 18.0.0` by running `node -v`.
