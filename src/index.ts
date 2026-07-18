import { Hono } from 'hono';
import { prettyJSON } from 'hono/pretty-json';
import type { AppContext } from './types/index.js';
import { corsMiddleware } from './middleware/cors.js';
import { loggerMiddleware } from './middleware/logger.js';
import type { ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { AppError } from './utils/errors.js';

import { campaignRoutes } from './routes/campaign.js';
import { characterRoutes } from './routes/character.js';
import { locationRoutes, planetRoutes, starSystemRoutes } from './routes/location.js';
import {
  organizationRoutes,
  shipRoutes,
  vehicleRoutes,
  objectRoutes,
} from './routes/entities.js';
import {
  eventRoutes,
  timelineRoutes,
  relationshipRoutes,
  secretRoutes,
} from './routes/events.js';
import {
  playerKnowledgeRoutes,
  worldKnowledgeRoutes,
  quoteRoutes,
  noteRoutes,
  sessionRoutes,
} from './routes/misc.js';
import { searchRoutes, contextRoutes } from './routes/search.js';

const app = new Hono<AppContext>();

// ── Global middleware ──────────────────────────────────────────────────────────
app.use('*', corsMiddleware);
app.use('*', loggerMiddleware);
app.use('*', prettyJSON());
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json(
      {
        success: false,
        error: {
          code: err.code,
          message: err.message,
          ...(err.details !== undefined ? { details: err.details } : {}),
        },
      },
      err.statusCode as Parameters<typeof c.json>[1],
    );
  }
  if (err instanceof ZodError) {
    return c.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: err.flatten() } },
      422,
    );
  }
  console.error('[UNHANDLED ERROR]', err);
  return c.json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, 500);
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (c) =>
  c.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    },
  }),
);

// ── API v1 ─────────────────────────────────────────────────────────────────────
const api = new Hono<AppContext>();

api.route('/campaigns', campaignRoutes);
api.route('/characters', characterRoutes);
api.route('/locations', locationRoutes);
api.route('/planets', planetRoutes);
api.route('/star-systems', starSystemRoutes);
api.route('/organizations', organizationRoutes);
api.route('/ships', shipRoutes);
api.route('/vehicles', vehicleRoutes);
api.route('/objects', objectRoutes);
api.route('/events', eventRoutes);
api.route('/timeline', timelineRoutes);
api.route('/relationships', relationshipRoutes);
api.route('/secrets', secretRoutes);
api.route('/knowledge/player', playerKnowledgeRoutes);
api.route('/knowledge/world', worldKnowledgeRoutes);
api.route('/quotes', quoteRoutes);
api.route('/notes', noteRoutes);
api.route('/sessions', sessionRoutes);
api.route('/search', searchRoutes);
api.route('/context', contextRoutes);

app.route('/api', api);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.notFound((c) =>
  c.json(
    {
      success: false,
      error: { code: 'NOT_FOUND', message: `Route ${c.req.method} ${c.req.path} not found` },
    },
    404,
  ),
);

export default app;
