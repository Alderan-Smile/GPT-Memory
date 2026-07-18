import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { AppContext } from '../types/index.js';
import { EventService, TimelineService, RelationshipService } from '../services/events.js';
import { SecretService } from '../services/knowledge.js';
import { createEventSchema, updateEventSchema, createTimelineSchema, updateTimelineSchema } from '../validators/event.js';
import { createRelationshipSchema, updateRelationshipSchema, createSecretSchema, updateSecretSchema } from '../validators/relationship.js';
import { listQuerySchema, idParamSchema } from '../validators/common.js';
import { ok } from '../utils/response.js';

const withCampaign = z.object({ campaignId: z.string().min(1) });

export const eventRoutes = new Hono<AppContext>();

eventRoutes.get('/', zValidator('query', listQuerySchema.merge(withCampaign).extend({
  planet: z.string().optional(), era: z.string().optional(),
})), async (c) => {
  const q = c.req.valid('query');
  return c.json(await new EventService(c.env.DB).list(q.campaignId, q));
});
eventRoutes.post('/', zValidator('json', createEventSchema), async (c) => {
  return c.json(ok(await new EventService(c.env.DB).create(c.req.valid('json'))), 201);
});
eventRoutes.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  return c.json(ok(await new EventService(c.env.DB).getById(id, campaignId)));
});
eventRoutes.patch('/:id', zValidator('param', idParamSchema), zValidator('json', updateEventSchema.extend({ campaignId: z.string().min(1) })), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId, ...body } = c.req.valid('json');
  return c.json(ok(await new EventService(c.env.DB).update(id, campaignId!, body)));
});
eventRoutes.delete('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  await new EventService(c.env.DB).delete(id, campaignId);
  return c.json(ok(null));
});

export const timelineRoutes = new Hono<AppContext>();

timelineRoutes.get('/', zValidator('query', listQuerySchema.merge(withCampaign)), async (c) => {
  const q = c.req.valid('query');
  return c.json(await new TimelineService(c.env.DB).list(q.campaignId, q));
});
timelineRoutes.post('/', zValidator('json', createTimelineSchema), async (c) => {
  return c.json(ok(await new TimelineService(c.env.DB).create(c.req.valid('json'))), 201);
});
timelineRoutes.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  return c.json(ok(await new TimelineService(c.env.DB).getById(id, campaignId)));
});
timelineRoutes.patch('/:id', zValidator('param', idParamSchema), zValidator('json', updateTimelineSchema.extend({ campaignId: z.string().min(1) })), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId, ...body } = c.req.valid('json');
  return c.json(ok(await new TimelineService(c.env.DB).update(id, campaignId!, body)));
});

export const relationshipRoutes = new Hono<AppContext>();

relationshipRoutes.get('/', zValidator('query', listQuerySchema.merge(withCampaign).extend({
  characterId: z.string().optional(), type: z.string().optional(),
})), async (c) => {
  const q = c.req.valid('query');
  return c.json(await new RelationshipService(c.env.DB).list(q.campaignId, q));
});
relationshipRoutes.post('/', zValidator('json', createRelationshipSchema), async (c) => {
  return c.json(ok(await new RelationshipService(c.env.DB).create(c.req.valid('json'))), 201);
});
relationshipRoutes.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  return c.json(ok(await new RelationshipService(c.env.DB).getById(id, campaignId)));
});
relationshipRoutes.patch('/:id', zValidator('param', idParamSchema), zValidator('json', updateRelationshipSchema.extend({ campaignId: z.string().min(1) })), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId, ...body } = c.req.valid('json');
  return c.json(ok(await new RelationshipService(c.env.DB).update(id, campaignId!, body)));
});
relationshipRoutes.delete('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  await new RelationshipService(c.env.DB).delete(id, campaignId);
  return c.json(ok(null));
});

export const secretRoutes = new Hono<AppContext>();

secretRoutes.get('/', zValidator('query', listQuerySchema.merge(withCampaign).extend({
  revealed: z.coerce.boolean().optional(),
  visibleToPlayer: z.coerce.boolean().optional(),
})), async (c) => {
  const q = c.req.valid('query');
  return c.json(await new SecretService(c.env.DB).list(q.campaignId, q));
});
secretRoutes.post('/', zValidator('json', createSecretSchema), async (c) => {
  return c.json(ok(await new SecretService(c.env.DB).create(c.req.valid('json'))), 201);
});
secretRoutes.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  return c.json(ok(await new SecretService(c.env.DB).getById(id, campaignId)));
});
secretRoutes.patch('/:id', zValidator('param', idParamSchema), zValidator('json', updateSecretSchema.extend({ campaignId: z.string().min(1) })), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId, ...body } = c.req.valid('json');
  return c.json(ok(await new SecretService(c.env.DB).update(id, campaignId!, body)));
});
secretRoutes.delete('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
  const { id } = c.req.valid('param');
  const { campaignId } = c.req.valid('query');
  await new SecretService(c.env.DB).delete(id, campaignId);
  return c.json(ok(null));
});
