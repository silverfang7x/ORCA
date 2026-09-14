---
# ORCA — Project Context

## What this is
A conversational multi-agent AI platform for fishermen and coastal
authorities (SIH26176, sponsored by ISRO). A user asks natural-language
questions like "Is it safe to fish near Kochi tomorrow?" and the system
orchestrates multiple specialized AI agents to answer with cited,
explainable recommendations.

## Architecture
One query flows through:
User query -> Language Detector -> Planner Agent (decides which sub-agents
to call) -> parallel calls to Weather/Ocean Agent, Hazard/Geofence Agent ->
Synthesizer Agent (combines everything, cites sources, flags uncertainty)
-> translated back to user's language -> returned to frontend.

## Team & ownership (do not build over these boundaries)
- Suryansh: Planner agent, Synthesizer agent, LangGraph wiring, multilingual
  layer, Fisherman Chat UI, Official Dashboard shell, SOS/broadcast routes,
  deployment, integration.
- Aditi: backend/src/agents/weatherOceanAgent.ts (Weather & Ocean data,
  using Open-Meteo Marine API) AND the entire frontend/app/fisherman/home
  route (quick dashboard: weather card, tide chart, wave display, SOS
  button, PDF export of daily advisory).
- Kunal: backend/src/agents/hazardGeofenceAgent.ts (hazard alerts +
  geofencing, using Turf.js and a static GeoJSON boundary file) AND the
  alert broadcast panel + hazard zone overlay inside the Official
  Dashboard.

## Tech stack
- Frontend: Next.js (App Router) + TypeScript + shadcn/ui + Tailwind
- Backend: Node.js + Express + TypeScript + LangGraph.js
- LLM: Groq API (free tier)
- Ocean/weather data: Open-Meteo Marine API (free, no key)
- Geofencing: Turf.js
- Multilingual: Bhashini API, Google Translate as fallback
- Map: Leaflet.js + OpenStreetMap
- Deployment: Vercel (frontend), Render or Railway (backend)

## Three product surfaces (all call the same backend)
1. Fisherman Home (quick dashboard) - Aditi
2. Fisherman Chat (the core conversational interface) - Suryansh
3. Official Dashboard (professional/org view: map, alert broadcast,
   optional historical trends) - Suryansh (shell) + Kunal (alert section)

## Shared contract
All agents read/write against types defined in packages/shared/src/types.ts.
This file should be treated as stable once teammates start building against
it - do not change field names or types without updating everyone.
---
