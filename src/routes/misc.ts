import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { AppContext } from '../types/index.js';
import { PlayerKnowledgeService, WorldKnowledgeService } from '../services/knowledge.js';
import { QuoteService, NoteService, SessionService } from '../services/misc.js';
import {
  createPlayerKnowledgeSchema, updatePlayerKnowledgeSchema,
  createWorldKnowledgeSchema, updateWorldKnowledgeSchema,
} from '../validators/knowledge.js';
import { createQuoteSchema, updateQuoteSchema, createNoteSchema, updateNoteSchema, createSessionSchema, updateSessionSchema } from '../validators/misc.js';
import { listQuerySchema, idParamSchema } from '../validators/common.js';
import { ok } from '../utils/response.js';

const withCampaign = z.object({ campaignId: z.string().min(1) });

export const playerKnowledgeRoutes = new Hono<AppContext>();

playerKnowledgeRoutes.get('/', zValidator('query', listQuerySchema.merge(withCampaign).extend({
  characterId: z.string().optional(), category: z.string().optional(),
})), async (c) => {
  const q = c.req.valid('query');
  return c.json(await new PlayerKnowledgeService(c.env.DB).list(q.campaignId, q));
});
playerKnowledgeRoutes.post('/', zValidator('json', createPlayerKnowledgeSchema), async (c) => {
  return c.json(ok(await new PlayerKnowledgeService(c.env.DB).create(c.req.valid('json'))), 201);
});
playerKnowledgeRoutes.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  return c.json(ok(await new PlayerKnowledgeService(c.env.DB).getById(id, campaignId)));
});
playerKnowledgeRoutes.patch('/:id', zValidator('param', idParamSchema), zValidator('json', updatePlayerKnowledgeSchema.extend({ campaignId: z.string() })), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId, ...body } = c.req.valid('json');
  return c.json(ok(await new PlayerKnowledgeService(c.env.DB).update(id, campaignId!, body)));
});
playerKnowledgeRoutes.delete('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  await new PlayerKnowledgeService(c.env.DB).delete(id, campaignId);
  return c.json(ok(null));
});

export const worldKnowledgeRoutes = new Hono<AppContext>();

worldKnowledgeRoutes.get('/', zValidator('query', listQuerySchema.merge(withCampaign).extend({
  category: z.string().optional(), canon: z.coerce.boolean().optional(),
})), async (c) => {
  const q = c.req.valid('query');
  return c.json(await new WorldKnowledgeService(c.env.DB).list(q.campaignId, q));
});
worldKnowledgeRoutes.post('/', zValidator('json', createWorldKnowledgeSchema), async (c) => {
  return c.json(ok(await new WorldKnowledgeService(c.env.DB).create(c.req.valid('json'))), 201);
});
worldKnowledgeRoutes.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  return c.json(ok(await new WorldKnowledgeService(c.env.DB).getById(id, campaignId)));
});
worldKnowledgeRoutes.patch('/:id', zValidator('param', idParamSchema), zValidator('json', updateWorldKnowledgeSchema.extend({ campaignId: z.string() })), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId, ...body } = c.req.valid('json');
  return c.json(ok(await new WorldKnowledgeService(c.env.DB).update(id, campaignId!, body)));
});
worldKnowledgeRoutes.delete('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  await new WorldKnowledgeService(c.env.DB).delete(id, campaignId);
  return c.json(ok(null));
});

export const quoteRoutes = new Hono<AppContext>();

quoteRoutes.get('/', zValidator('query', listQuerySchema.merge(withCampaign).extend({ author: z.string().optional() })), async (c) => {
  const q = c.req.valid('query');
  return c.json(await new QuoteService(c.env.DB).list(q.campaignId, q));
});
quoteRoutes.post('/', zValidator('json', createQuoteSchema), async (c) => {
  return c.json(ok(await new QuoteService(c.env.DB).create(c.req.valid('json'))), 201);
});
quoteRoutes.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  return c.json(ok(await new QuoteService(c.env.DB).getById(id, campaignId)));
});
quoteRoutes.patch('/:id', zValidator('param', idParamSchema), zValidator('json', updateQuoteSchema.extend({ campaignId: z.string() })), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId, ...body } = c.req.valid('json');
  return c.json(ok(await new QuoteService(c.env.DB).update(id, campaignId!, body)));
});
quoteRoutes.delete('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  await new QuoteService(c.env.DB).delete(id, campaignId);
  return c.json(ok(null));
});

export const noteRoutes = new Hono<AppContext>();

noteRoutes.get('/', zValidator('query', listQuerySchema.merge(withCampaign).extend({
  entityId: z.string().optional(), entityType: z.string().optional(), pinned: z.coerce.boolean().optional(),
})), async (c) => {
  const q = c.req.valid('query');
  return c.json(await new NoteService(c.env.DB).list(q.campaignId, q));
});
noteRoutes.post('/', zValidator('json', createNoteSchema), async (c) => {
  return c.json(ok(await new NoteService(c.env.DB).create(c.req.valid('json'))), 201);
});
noteRoutes.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  return c.json(ok(await new NoteService(c.env.DB).getById(id, campaignId)));
});
noteRoutes.patch('/:id', zValidator('param', idParamSchema), zValidator('json', updateNoteSchema.extend({ campaignId: z.string() })), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId, ...body } = c.req.valid('json');
  return c.json(ok(await new NoteService(c.env.DB).update(id, campaignId!, body)));
});
noteRoutes.delete('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  await new NoteService(c.env.DB).delete(id, campaignId);
  return c.json(ok(null));
});

export const sessionRoutes = new Hono<AppContext>();

sessionRoutes.get('/', zValidator('query', listQuerySchema.merge(withCampaign)), async (c) => {
  const q = c.req.valid('query');
  return c.json(await new SessionService(c.env.DB).list(q.campaignId, q));
});
sessionRoutes.post('/', zValidator('json', createSessionSchema), async (c) => {
  return c.json(ok(await new SessionService(c.env.DB).create(c.req.valid('json'))), 201);
});
sessionRoutes.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  return c.json(ok(await new SessionService(c.env.DB).getById(id, campaignId)));
});
sessionRoutes.patch('/:id', zValidator('param', idParamSchema), zValidator('json', updateSessionSchema.extend({ campaignId: z.string() })), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId, ...body } = c.req.valid('json');
  return c.json(ok(await new SessionService(c.env.DB).update(id, campaignId!, body)));
});
sessionRoutes.delete('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  await new SessionService(c.env.DB).delete(id, campaignId);
  return c.json(ok(null));
});
