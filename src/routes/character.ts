import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import type { AppContext } from '../types/index.js';
import { CharacterService } from '../services/character.js';
import { createCharacterSchema, updateCharacterSchema } from '../validators/character.js';
import { listQuerySchema, idParamSchema } from '../validators/common.js';
import { ok } from '../utils/response.js';

export const characterRoutes = new Hono<AppContext>();

const characterListSchema = listQuerySchema.extend({
  campaignId: z.string().min(1),
  status: z.enum(['alive', 'dead', 'unknown', 'missing']).optional(),
});

characterRoutes.get('/', zValidator('query', characterListSchema), async (c) => {
  const query = c.req.valid('query');
  const svc = new CharacterService(c.env.DB);
  const result = await svc.list(query.campaignId, query);
  return c.json(result);
});

characterRoutes.post('/', zValidator('json', createCharacterSchema), async (c) => {
  const body = c.req.valid('json');
  const svc = new CharacterService(c.env.DB);
  const character = await svc.create(body);
  return c.json(ok(character), 201);
});

characterRoutes.get(
  '/:id',
  zValidator('param', idParamSchema),
  zValidator('query', z.object({ campaignId: z.string().min(1) })),
  async (c) => {
    const { id } = c.req.valid('param');
    const { campaignId } = c.req.valid('query');
    const svc = new CharacterService(c.env.DB);
    const character = await svc.getById(id, campaignId);
    return c.json(ok(character));
  },
);

characterRoutes.patch(
  '/:id',
  zValidator('param', idParamSchema),
  zValidator('json', updateCharacterSchema.extend({ campaignId: z.string().min(1) })),
  async (c) => {
    const { id } = c.req.valid('param');
    const { campaignId, ...body } = c.req.valid('json');
    const svc = new CharacterService(c.env.DB);
    const character = await svc.update(id, campaignId, body);
    return c.json(ok(character));
  },
);

characterRoutes.delete(
  '/:id',
  zValidator('param', idParamSchema),
  zValidator('query', z.object({ campaignId: z.string().min(1) })),
  async (c) => {
    const { id } = c.req.valid('param');
    const { campaignId } = c.req.valid('query');
    const svc = new CharacterService(c.env.DB);
    await svc.delete(id, campaignId);
    return c.json(ok(null), 200);
  },
);
