<div align="center">

<br/>

<img src="https://img.shields.io/badge/ORCA-Marine%20Intelligence-0e7490?style=for-the-badge&logoColor=white" alt="ORCA" height="40"/>

<br/>
<br/>

# 🌊 ORCA — Multi-Agent Marine Intelligence Platform

**Conversational AI for Fishermen & Coastal Authorities**
*Smart India Hackathon 2026 · Problem Statement SIH26176 · Sponsored by ISRO & Department of Space*

<br/>

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-orca--frontend--ten.vercel.app-06b6d4?style=for-the-badge)](https://orca-frontend-ten.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![LangGraph](https://img.shields.io/badge/LangGraph-FF6B35?style=for-the-badge&logoColor=white)](https://langchain-ai.github.io/langgraphjs/)
[![Groq](https://img.shields.io/badge/Groq_LLM-F55036?style=for-the-badge&logoColor=white)](https://groq.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://orca-frontend-ten.vercel.app/)
[![ISRO](https://img.shields.io/badge/Sponsored_by-ISRO-003087?style=for-the-badge)](https://www.isro.gov.in/)

<br/>

> **Ask ORCA anything in your regional language:**
> *"Is it safe to fish near Kochi tomorrow?"* → ORCA orchestrates multiple specialized AI agents, fetches live ocean telemetry, evaluates geofence boundaries, and returns a cited, explainable safety advisory — translated back to your language.

<br/>

</div>

---

## 📺 Live Demo

> 🌐 **[https://orca-frontend-ten.vercel.app/](https://orca-frontend-ten.vercel.app/)**

| Surface | URL | Audience |
|---|---|---|
| 🏠 Landing Page | [`/`](https://orca-frontend-ten.vercel.app/) | All users |
| 🎣 Fisherman Chat | [`/fisherman/chat`](https://orca-frontend-ten.vercel.app/fisherman/chat) | Fishermen |
| 📊 Fisherman Home | [`/fisherman/home`](https://orca-frontend-ten.vercel.app/fisherman/home) | Fishermen |
| 🛡️ Official Dashboard | [`/official/dashboard`](https://orca-frontend-ten.vercel.app/official/dashboard) | Coastal Authorities |

---

## ✨ What is ORCA?

ORCA is a **conversational multi-agent AI platform** built for fishermen and coastal authorities across India's coastline. It solves a real operational challenge: how do fishing communities — who often speak regional languages — get reliable, real-time, explainable marine safety guidance?

A user asks a natural-language question like *"क्या कल केरल के पास मछली पकड़ना सुरक्षित है?"* (Hindi) and ORCA:

1. 🌐 **Detects the language** automatically using Unicode script range inspection (Malayalam, Hindi, Tamil, Telugu, Kannada, Bengali, Gujarati)
2. 🔄 **Translates** the query to English via the **Bhashini ULCA API** (with Groq LLM as fallback)
3. 🧠 **Routes to specialized agents** using a **Planner Agent** that uses an LLM to classify query intent
4. 🌊 **Fetches live ocean data** — wave height, sea surface temperature, wind speed, tide forecasts via Open-Meteo Marine API
5. 🗺️ **Evaluates geofence boundaries** — IMBL, restricted maritime zones, port channels, coral conservation areas using Turf.js spatial analysis
6. ✍️ **Synthesizes** a structured safety advisory with exact numeric readings, a clear verdict, and cited data sources
7. 🔁 **Translates** the final answer back to the user's regional language

---

## 🏗️ Architecture

### Query Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                   User (Fisherman / Official)                       │
│               Any regional language query                           │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🌐  Multilingual Layer                           │
│     Unicode script detection → Bhashini ULCA → Groq LLM fallback   │
│   Malayalam · Hindi · Tamil · Telugu · Kannada · Bengali · Gujarati │
└───────────────────────────────┬─────────────────────────────────────┘
                                │  English query
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   🧠  Planner Agent  (Groq LLM)                     │
│         Classifies intent: needsWeather? · needsHazard?             │
└──────────────────┬────────────────────────────┬─────────────────────┘
                   │                            │
          ┌────────▼──────────┐      ┌──────────▼────────┐
          │  🌊 Weather &     │      │  🗺️  Hazard &     │
          │   Ocean Agent     │      │  Geofence Agent    │
          │                   │      │                    │
          │ Open-Meteo        │      │ Turf.js +          │
          │ Marine API        │      │ GeoJSON +          │
          │ (free · no key)   │      │ Haversine formula  │
          └────────┬──────────┘      └──────────┬─────────┘
                   │   parallel execution        │
                   └──────────────┬──────────────┘
                                  │ results merged
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                 ✍️  Synthesizer Agent  (Groq LLM)                   │
│  Telemetry + hazard data → verdict + numeric readings + citations   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    🌐  Multilingual Layer (Output)                  │
│              Translate final advisory → user's language             │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
                    Frontend — SSE Streaming UI
                    (real-time agent trace panel)
```

### Deployment Architecture

```
  ┌────────────────────────────────┐
  │   Vercel (Frontend)            │
  │   Next.js 16 App Router        │
  │   orca-frontend-ten.vercel.app │
  └──────────────┬─────────────────┘
                 │  REST / Server-Sent Events (SSE)
                 ▼
  ┌────────────────────────────────┐
  │   Render (Backend)             │
  │   Express + LangGraph.js       │
  │   orca-backend.onrender.com    │
  └────────────────────────────────┘
```

---

## 🤖 Agent Breakdown

| Agent | Technology | Responsibility |
|---|---|---|
| **Multilingual Layer** | Bhashini ULCA API + Groq LLM fallback | Script detection via Unicode ranges, bi-directional translation for 7 Indian languages, in-memory pipeline config caching |
| **Planner Agent** | Groq LLM (`gpt-oss-20b`, `qwen3.8-27b`) | Parses user intent — classifies `needsWeather` and `needsHazard` boolean flags to conditionally route agent calls |
| **Weather & Ocean Agent** | Open-Meteo Marine API (free, no key) | Fetches live wave height (m), sea surface temperature (°C), wind speed (km/h), tide cycle forecasts; 60-min in-memory cache |
| **Hazard & Geofence Agent** | Turf.js + GeoJSON + Haversine | Point-in-polygon spatial evaluation against maritime boundary GeoJSON; proximity distance to nearest boundary in km |
| **Synthesizer Agent** | Groq LLM (`gpt-oss-120b`, `gpt-oss-20b`) | Fuses all data into a structured, cited safety advisory with unambiguous verdict + exact numeric readings |

### LangGraph State Machine

```typescript
// Conditional routing from Planner intent flags
START → planner → [weatherAgent?, hazardAgent?] (parallel) → synthesizer → END
```

Real-time progress is streamed via **Server-Sent Events (SSE)** — each agent emits `started`, `completed`, or `failed` events with duration timestamps, rendered live in the chat UI's agent trace panel.

---

## 🖥️ Product Surfaces

### 🎣 Fisherman Portal (`/fisherman/*`)

| Screen | Path | Key Features |
|---|---|---|
| **Home Dashboard** | `/fisherman/home` | Weather card, tide chart, wave display, one-tap SOS, PDF daily advisory export |
| **Chat** *(core)* | `/fisherman/chat` | Natural-language queries, SSE streaming agent trace, voice input (Web Speech API), preset query chips, live telemetry strip |
| **Fishing Advisory** | `/fisherman/fishing-advisory` | Zone-based advisories, recommended fishing windows |
| **Weather & Ocean Data** | `/fisherman/weather-ocean-data` | Live marine telemetry from Open-Meteo |
| **Hazards & Alerts** | `/fisherman/hazards-alerts` | Active broadcast alerts, high-swell & cyclone warnings |
| **Geofencing & Boundaries** | `/fisherman/geofencing-boundaries` | Leaflet map with heatmap overlay, IMBL buffer, coral reserves, port channels |
| **Agent Activity** | `/fisherman/agent-activity` | Live multi-agent execution trace with per-agent timing |
| **Reports & Analytics** | `/fisherman/reports-analytics` | Historical query trends and usage data |
| **Settings** | `/fisherman/settings` | Language selector (English, Hindi, Malayalam, Tamil), Bhashini pipeline toggle, audio alert preferences |

### 🛡️ Official Coastal Command Dashboard (`/official/*`)

| Screen | Path | Key Features |
|---|---|---|
| **Overview** | `/official/dashboard` | System status, KPIs, active alert summary |
| **Live Alerts** | `/official/dashboard/alerts` | Broadcast alert management and creation interface |
| **Regional Map** | `/official/dashboard/map` | Interactive Leaflet map with vessel markers and hazard overlays |
| **Geofencing** | `/official/dashboard/geofencing` | Maritime boundary zone management |
| **Vessel Tracking** | `/official/dashboard/vessels` | Vessel position monitoring |
| **Historical Trends** | `/official/dashboard/trends` | Wave height & SST trend charts (Recharts) |
| **Reports & Analytics** | `/official/dashboard/reports` | Query history, usage statistics |
| **Users & Permissions** | `/official/dashboard/users` | Organization-level user management |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.3.5 | App Router, server components, SSE response streaming |
| **TypeScript** | ^5 | End-to-end type safety |
| **Tailwind CSS** | v4 | Utility-first styling system |
| **Framer Motion** | ^13.4 | Animated landing page hero, micro-animations |
| **Leaflet.js + React-Leaflet** | ^1.9 / ^5.0 | Interactive maritime maps |
| **Leaflet.heat** | ^0.2 | Thermal heatmap overlay for geofence zone visualization |
| **Recharts** | ^3.10 | Historical ocean trend charts |
| **Radix UI** | various | Accessible dialog, tabs, sheet primitives |
| **Lucide React** | ^0.475 | Icon system |
| **@orca/shared** | workspace | Shared TypeScript type definitions |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Node.js + Express** | ^4.19 | REST API server and SSE streaming endpoint |
| **TypeScript** | ^5.3 | Fully typed backend |
| **LangGraph.js** | ^0.2.55 | Multi-agent state machine orchestration with conditional routing |
| **LangChain Core** | ^0.3.40 | Foundation for agent abstractions |
| **Groq SDK** | ^0.7 | LLM inference (Planner, Synthesizer, translation fallback) |
| **Turf.js** | ^7.4 | Geospatial point-in-polygon and distance calculations |

### External APIs & Data Sources

| Source | What It Provides | Auth Required |
|---|---|---|
| **Open-Meteo Marine API** | Wave height, sea surface temp, wind speed, tide heights | ❌ Free, no key |
| **Groq Cloud** | Fast LLM inference for Planner + Synthesizer + translation | ✅ `GROQ_API_KEY` |
| **Bhashini ULCA/Dhruva API** | Government-grade Indian language translation | ✅ `BHASHINI_USER_ID` + `BHASHINI_ULCA_API_KEY` |
| **OpenStreetMap** | Base map tiles (via Leaflet) | ❌ Free |
| **Local GeoJSON** | Maritime boundary polygons (`maritimeBoundaries.geojson`) | Bundled |
| **Local JSON** | Hazard alert dataset (`hazardAlerts.json`) | Bundled |

---

## 📁 Project Structure

```
ORCA/                                  ← Monorepo root (npm workspaces)
├── frontend/                          ← Next.js 16 App Router  (→ Vercel)
│   ├── app/
│   │   ├── page.tsx                   ← Animated landing / role selector
│   │   ├── fisherman/
│   │   │   ├── layout.tsx             ← FishermanNav + LanguageProvider
│   │   │   ├── home/                  ← Quick weather dashboard
│   │   │   ├── chat/                  ← Core conversational interface
│   │   │   ├── fishing-advisory/
│   │   │   ├── weather-ocean-data/
│   │   │   ├── hazards-alerts/
│   │   │   ├── geofencing-boundaries/ ← Leaflet + heatmap
│   │   │   ├── agent-activity/
│   │   │   ├── reports-analytics/
│   │   │   ├── settings/              ← Language + Bhashini config
│   │   │   └── users-permissions/
│   │   └── official/
│   │       └── dashboard/             ← Command center + sub-routes
│   ├── components/
│   │   ├── chat/                      ← ChatWindow · MessageBubble
│   │   │   │                            VoiceInput · AgentThinkingTrace
│   │   │   │                            ExplainabilityPanel · InlineAgentTrace
│   │   │   └── QuickOverviewList
│   │   ├── dashboard/                 ← HistoricalTrendChart
│   │   ├── layout/                    ← FishermanNav
│   │   ├── map/                       ← LeafletMap · LeafletMapInner
│   │   └── ui/                        ← shadcn/ui primitives
│   └── lib/
│       ├── LanguageContext.tsx         ← Global i18n state + useTranslation hook
│       ├── translations/              ← en.json · hi.json · ml.json · ta.json
│       └── utils.ts
│
├── backend/                           ← Express + LangGraph  (→ Render)
│   └── src/
│       ├── server.ts                  ← REST + SSE API endpoints
│       ├── graph.ts                   ← LangGraph pipeline + ProgressCallback
│       ├── multilingual.ts            ← Bhashini + Groq translation layer
│       └── agents/
│           ├── plannerAgent.ts        ← Groq intent classification
│           ├── weatherOceanAgent.ts   ← Open-Meteo Marine API
│           ├── hazardGeofenceAgent.ts ← Turf.js geofence evaluation
│           └── synthesizerAgent.ts    ← Groq advisory synthesis
│
├── packages/
│   └── shared/                        ← @orca/shared — shared TypeScript types
│       └── src/types.ts               ← AgentState · ChatMessage · LocationQuery
│
└── data/
    ├── hazardAlerts.json              ← Hazard alert dataset
    └── maritimeBoundaries.geojson     ← GeoJSON maritime boundary polygons
```

---

## 🌐 Multilingual Support

ORCA supports **7 Indian coastal languages** with zero-configuration automatic script detection.

| Language | Script | Unicode Range | Code |
|---|---|---|---|
| English | Latin | (default) | `en` |
| Malayalam | Malayalam | `\u0D00–\u0D7F` | `ml` |
| Hindi / Marathi | Devanagari | `\u0900–\u097F` | `hi` |
| Tamil | Tamil | `\u0B80–\u0BFF` | `ta` |
| Telugu | Telugu | `\u0C00–\u0C7F` | `te` |
| Kannada | Kannada | `\u0C80–\u0CFF` | `kn` |
| Bengali | Bengali | `\u0980–\u09FF` | `bn` |
| Gujarati | Gujarati | `\u0A80–\u0AFF` | `gu` |

**Translation Pipeline:**
1. **Bhashini ULCA API** — Government-grade primary pipeline with in-memory config caching
2. **Groq LLM** — Fast automatic fallback if Bhashini is unavailable

UI translations (navigation labels, button text, placeholder strings) are available in `en`, `hi`, `ml`, and `ta` via the `LanguageContext` i18n system.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Service health check → `{ "status": "ok" }` |
| `POST` | `/api/query` | Run full multi-agent pipeline (blocking response) |
| `POST` | `/api/query/stream` | **SSE streaming** — emits real-time agent progress events |
| `POST` | `/api/sos` | Log emergency SOS signal with coordinates |
| `POST` | `/api/broadcast` | Publish official broadcast alert |
| `GET` | `/api/broadcast` | Retrieve all active broadcast alerts |
| `GET` | `/api/history` | Query history + ocean telemetry log for trend charts |

### SSE Stream Events (`POST /api/query/stream`)

```jsonc
// event: progress  — emitted by each agent as it runs
{
  "agent": "weather",
  "agentName": "Weather & Ocean Agent",
  "status": "completed",
  "description": "Fetched ocean telemetry from Open-Meteo: Wave height 1.8m, Sea temp 28.4°C.",
  "durationMs": 1203,
  "timestamp": "2026-09-24T06:35:22.000Z"
}

// event: complete  — final state emitted when pipeline finishes
{
  "finalAnswer": "**VERDICT: SAFE TO FISH**\n- Wave Height: 1.8m ...",
  "sources": ["Open-Meteo Marine API", "Mock hazard dataset + Turf.js geofencing"]
}

// event: error  — emitted if pipeline fails
{ "error": "userQuery is required" }
```

### Query Request Body

```jsonc
// POST /api/query  or  POST /api/query/stream
{
  "userQuery": "Is it safe to fish near Kochi tomorrow?",
  "location": { "latitude": 9.9312, "longitude": 76.2673 },   // optional
  "preferredLanguage": "ml"                                    // optional
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **npm** v9+

### 1. Clone the Repository

```bash
git clone https://github.com/silverfang7x/ORCA.git
cd ORCA
```

### 2. Install All Dependencies

```bash
# Installs dependencies for frontend, backend, and @orca/shared in one command
npm install
```

### 3. Configure Environment Variables

**Backend** — create `backend/.env`:

```env
PORT=4000
GROQ_API_KEY=gsk_your_groq_api_key_here
BHASHINI_USER_ID=your_bhashini_user_id
BHASHINI_ULCA_API_KEY=your_bhashini_ulca_api_key
CORS_ORIGIN=http://localhost:3000
```

**Frontend** — create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

> 💡 **Groq API Key**: Free tier at [console.groq.com](https://console.groq.com)
> 💡 **Bhashini**: Register at [bhashini.gov.in](https://bhashini.gov.in) — Groq translation fallback activates automatically if Bhashini is unavailable.
> 💡 **Open-Meteo**: No API key needed — it's completely free.

### 4. Run in Development

```bash
# Start backend (port 4000) and frontend (port 3000) concurrently
npm run dev
```

Or separately:

```bash
# Terminal 1 — Backend
npm run dev --workspace=backend

# Terminal 2 — Frontend
npm run dev --workspace=frontend
```

Open **[http://localhost:3000](http://localhost:3000)** and select your role to get started.

---

## 📦 Build & Production

```bash
# Build shared types package + backend
npm run build:backend

# Build shared types package + frontend
npm run build:frontend

# Build everything (backend + frontend)
npm run build

# Run production backend locally
npm --workspace=backend run start
```

---

## ☁️ Deployment Guide

> Full step-by-step instructions: [`DEPLOYMENT.md`](./DEPLOYMENT.md)

| Service | Platform | URL |
|---|---|---|
| **Frontend** | [Vercel](https://vercel.com) | `https://orca-frontend-ten.vercel.app` |
| **Backend** | [Render](https://render.com) | `https://orca-backend.onrender.com` |

**Render Web Service settings:**

| Setting | Value |
|---|---|
| Root Directory | `.` (monorepo root) |
| Build Command | `npm run build:backend` |
| Start Command | `npm --workspace=backend run start` |

**Required environment variables on Render:**

```
PORT=10000
GROQ_API_KEY=gsk_...
BHASHINI_USER_ID=...
BHASHINI_ULCA_API_KEY=...
CORS_ORIGIN=https://orca-frontend-ten.vercel.app
```

**Required environment variable on Vercel:**

```
NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
```

After setting the Vercel variable, trigger a redeploy to embed the URL into the Next.js client bundle.

---

## 👥 Team & Ownership

| Member | Owned Components |
|---|---|
| **Suryansh** | Planner Agent · Synthesizer Agent · LangGraph wiring · Multilingual layer · Fisherman Chat UI · Official Dashboard shell · SOS/broadcast API routes · Deployment & integration |
| **Aditi** | `weatherOceanAgent.ts` (Open-Meteo Marine API) · Fisherman Home Dashboard (weather card, tide chart, wave display, SOS button, PDF advisory export) |
| **Kunal** | `hazardGeofenceAgent.ts` (Turf.js + GeoJSON geofencing) · Alert broadcast panel · Hazard zone overlay in Official Dashboard |

> ⚠️ **Shared Contract**: All agents read/write against types defined in `packages/shared/src/types.ts`. Field names and types are treated as stable — coordinate with the team before changing.

---

## 📄 Key Files Reference

| File | Purpose |
|---|---|
| [`backend/src/graph.ts`](./backend/src/graph.ts) | LangGraph state machine, conditional routing, SSE progress callbacks |
| [`backend/src/server.ts`](./backend/src/server.ts) | Express REST + SSE streaming endpoint definitions |
| [`backend/src/multilingual.ts`](./backend/src/multilingual.ts) | Bhashini ULCA + Groq translation layer with caching |
| [`backend/src/agents/plannerAgent.ts`](./backend/src/agents/plannerAgent.ts) | Groq LLM intent classification with model fallback chain |
| [`backend/src/agents/weatherOceanAgent.ts`](./backend/src/agents/weatherOceanAgent.ts) | Open-Meteo Marine API integration with 60-min cache |
| [`backend/src/agents/hazardGeofenceAgent.ts`](./backend/src/agents/hazardGeofenceAgent.ts) | Turf.js point-in-polygon geofence + Haversine proximity |
| [`backend/src/agents/synthesizerAgent.ts`](./backend/src/agents/synthesizerAgent.ts) | Groq LLM advisory synthesis with deterministic fallback |
| [`frontend/app/page.tsx`](./frontend/app/page.tsx) | Animated Framer Motion landing and role selection page |
| [`frontend/components/chat/ChatWindow.tsx`](./frontend/components/chat/ChatWindow.tsx) | Core chat UI — SSE streaming, voice input, preset chips |
| [`frontend/components/chat/ExplainabilityPanel.tsx`](./frontend/components/chat/ExplainabilityPanel.tsx) | "How ORCA Decided" — data source citation pills |
| [`frontend/lib/LanguageContext.tsx`](./frontend/lib/LanguageContext.tsx) | Global i18n state + `useTranslation` hook |
| [`packages/shared/src/types.ts`](./packages/shared/src/types.ts) | Shared `AgentState`, `ChatMessage`, `LocationQuery` types |
| [`data/hazardAlerts.json`](./data/hazardAlerts.json) | Static hazard alert radius dataset |
| [`data/maritimeBoundaries.geojson`](./data/maritimeBoundaries.geojson) | GeoJSON maritime boundary polygon definitions |
| [`CONTEXT.md`](./CONTEXT.md) | Full project context and team ownership boundaries |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Step-by-step Vercel + Render deployment guide |

---

## 📄 License

This project was built for **Smart India Hackathon 2026** (Problem Statement SIH26176), sponsored by ISRO & the Department of Space. All rights reserved.

---

<div align="center">

**Built with 🌊 for India's coastal communities**

[![Live Demo](https://img.shields.io/badge/🚀_Try_ORCA_Live-orca--frontend--ten.vercel.app-06b6d4?style=for-the-badge)](https://orca-frontend-ten.vercel.app/)

*ORCA — Smart India Hackathon 2026 · SIH26176 · ISRO Sponsored*

</div>
