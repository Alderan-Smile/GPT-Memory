import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { AppContext } from '../types/index.js';
import { SearchService } from '../services/search.js';
import { ContextService } from '../services/context.js';
import { searchQuerySchema, contextQuerySchema } from '../validators/search.js';

export const searchRoutes = new Hono<AppContext>();

searchRoutes.get('/', zValidator('query', searchQuerySchema), async (c) => {
  const query = c.req.valid('query');
  const svc = new SearchService(c.env.DB);
  const result = await svc.search(query);
  return c.json(result);
});

export const contextRoutes = new Hono<AppContext>();

contextRoutes.get('/', zValidator('query', contextQuerySchema), async (c) => {
  const query = c.req.valid('query');
  const svc = new ContextService(c.env.DB);
  const context = await svc.buildContext(query);
  return c.json({ success: true, data: context });
});
