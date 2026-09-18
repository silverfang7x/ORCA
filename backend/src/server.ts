import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { runOrcaGraph } from './graph';
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

app.listen(PORT, () => {
  console.log(`ORCA Backend server listening on port ${PORT}`);
});

export default app;
