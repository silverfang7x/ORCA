import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runOrcaGraph, AgentProgressEvent } from './graph';
import { SOSRequest, BroadcastAlert, LocationQuery } from '@orca/shared';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOriginsEnv = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;
const corsOptions: cors.CorsOptions = {
  origin: allowedOriginsEnv
    ? allowedOriginsEnv.includes(',')
      ? allowedOriginsEnv.split(',').map((o) => o.trim())
      : allowedOriginsEnv.trim()
    : '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// In-memory data stores for hackathon state management
const sosStore: (SOSRequest & { receivedAt: string })[] = [];
const broadcastStore: BroadcastAlert[] = [];
const queryHistoryStore: {
  id: string;
  timestamp: string;
  timeLabel: string;
  userQuery: string;
  location?: LocationQuery;
  waveHeight?: number;
  seaSurfaceTemp?: number;
}[] = [
  { id: "HIS-101", timestamp: "2026-09-18T18:00:00.000Z", timeLabel: "06:00 AM", userQuery: "Is it safe to fish near Kochi tomorrow?", waveHeight: 1.2, seaSurfaceTemp: 28.1 },
  { id: "HIS-102", timestamp: "2026-09-18T19:00:00.000Z", timeLabel: "07:00 AM", userQuery: "What is the wave height near Chennai?", waveHeight: 1.4, seaSurfaceTemp: 28.3 },
  { id: "HIS-103", timestamp: "2026-09-18T20:00:00.000Z", timeLabel: "08:00 AM", userQuery: "High swell warnings in Sector 4?", waveHeight: 2.1, seaSurfaceTemp: 28.7 },
  { id: "HIS-104", timestamp: "2026-09-18T21:00:00.000Z", timeLabel: "09:00 AM", userQuery: "Tide forecast for Munambam Harbour", waveHeight: 1.8, seaSurfaceTemp: 28.5 },
  { id: "HIS-105", timestamp: "2026-09-18T22:00:00.000Z", timeLabel: "10:00 AM", userQuery: "Am I near any geofence boundary?", waveHeight: 1.5, seaSurfaceTemp: 28.2 },
];

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

/**
 * 1. POST /api/query
 * Invokes the multi-agent LangGraph workflow for user natural-language queries.
 */
app.post('/api/query', async (req: Request, res: Response) => {
  try {
    const { userQuery, location } = req.body as {
      userQuery: string;
      location?: LocationQuery;
    };

    if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
      return res.status(400).json({ error: 'userQuery is required and must be a non-empty string.' });
    }

    const resultState = await runOrcaGraph(userQuery, location);

    queryHistoryStore.push({
      id: `HIS-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userQuery,
      location,
      waveHeight: resultState.weatherData?.waveHeightMeters || 1.4,
      seaSurfaceTemp: resultState.weatherData?.seaSurfaceTempCelsius || 28.2,
    });

    return res.json(resultState);
  } catch (error: any) {
    console.error('[API /api/query Error]:', error);
    return res.status(500).json({
      error: 'Failed to process query',
      message: error?.message || 'An unexpected error occurred.'
    });
  }
});

/**
 * 1b. POST /api/query/stream
 * Server-Sent Events (SSE) streaming endpoint for real-time agent execution progress.
 */
app.post('/api/query/stream', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  try {
    const { userQuery, location } = req.body as {
      userQuery: string;
      location?: LocationQuery;
    };

    if (!userQuery || typeof userQuery !== 'string' || !userQuery.trim()) {
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'userQuery is required' })}\n\n`);
      return res.end();
    }

    const finalState = await runOrcaGraph(userQuery, location, (event: AgentProgressEvent) => {
      res.write(`event: progress\ndata: ${JSON.stringify(event)}\n\n`);
    });

    queryHistoryStore.push({
      id: `HIS-${Date.now()}`,
      timestamp: new Date().toISOString(),
      timeLabel: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userQuery,
      location,
      waveHeight: finalState.weatherData?.waveHeightMeters || 1.4,
      seaSurfaceTemp: finalState.weatherData?.seaSurfaceTempCelsius || 28.2,
    });

    res.write(`event: complete\ndata: ${JSON.stringify(finalState)}\n\n`);
    res.end();
  } catch (error: any) {
    console.error('[API /api/query/stream Error]:', error);
    res.write(`event: error\ndata: ${JSON.stringify({ error: error?.message || 'Streaming failed' })}\n\n`);
    res.end();
  }
});

/**
 * 2. POST /api/sos
 * Logs emergency SOS signals and stores in memory.
 */
app.post('/api/sos', (req: Request, res: Response) => {
  try {
    const sosPayload = req.body as SOSRequest;

    if (!sosPayload || typeof sosPayload.latitude !== 'number' || typeof sosPayload.longitude !== 'number') {
      return res.status(400).json({ error: 'Invalid SOS payload. Latitude and longitude numbers are required.' });
    }

    const timestamp = sosPayload.timestamp || new Date().toISOString();
    const sosEntry = {
      ...sosPayload,
      receivedAt: new Date().toISOString()
    };

    sosStore.push(sosEntry);
    console.log(`[SOS EMERGENCY ALERT RECEIVED at ${timestamp}]:`, JSON.stringify(sosEntry, null, 2));

    return res.json({
      received: true,
      timestamp
    });
  } catch (error: any) {
    console.error('[API /api/sos Error]:', error);
    return res.status(500).json({
      error: 'Failed to process SOS alert',
      message: error?.message || 'An unexpected error occurred.'
    });
  }
});

/**
 * 3. POST /api/broadcast
 * Submits an official broadcast alert to memory.
 */
app.post('/api/broadcast', (req: Request, res: Response) => {
  try {
    const alertPayload = req.body as BroadcastAlert;

    if (!alertPayload || !alertPayload.region || !alertPayload.type || !alertPayload.message) {
      return res.status(400).json({ error: 'Invalid Broadcast Alert payload. Region, type, and message are required.' });
    }

    broadcastStore.push(alertPayload);
    console.log('[BROADCAST ALERT PUBLISHED]:', JSON.stringify(alertPayload, null, 2));

    return res.json({ broadcast: true });
  } catch (error: any) {
    console.error('[API /api/broadcast Error]:', error);
    return res.status(500).json({
      error: 'Failed to publish broadcast alert',
      message: error?.message || 'An unexpected error occurred.'
    });
  }
});

/**
 * 4. GET /api/broadcast
 * Returns all active broadcast alerts for Fisherman / Official dashboards.
 */
app.get('/api/broadcast', (req: Request, res: Response) => {
  try {
    return res.json(broadcastStore);
  } catch (error: any) {
    console.error('[API GET /api/broadcast Error]:', error);
    return res.status(500).json({
      error: 'Failed to fetch broadcast alerts',
      message: error?.message || 'An unexpected error occurred.'
    });
  }
});

/**
 * 5. GET /api/history
 * Returns historical query volume & ocean telemetry log for dashboard trend charts.
 */
app.get('/api/history', (req: Request, res: Response) => {
  try {
    return res.json(queryHistoryStore);
  } catch (error: any) {
    console.error('[API GET /api/history Error]:', error);
    return res.status(500).json({
      error: 'Failed to fetch query history',
      message: error?.message || 'An unexpected error occurred.'
    });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`ORCA Backend server listening on port ${PORT}`);
  });
}

export default app;
