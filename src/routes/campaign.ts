import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { AppContext } from '../types/index.js';
import { CampaignService } from '../services/campaign.js';
import { createCampaignSchema, updateCampaignSchema } from '../validators/campaign.js';
import { listQuerySchema, idParamSchema } from '../validators/common.js';
import { ok } from '../utils/response.js';

export const campaignRoutes = new Hono<AppContext>();

campaignRoutes.get('/', zValidator('query', listQuerySchema), async (c) => {
  const query = c.req.valid('query');
  const svc = new CampaignService(c.env.DB);
  const result = await svc.list(query);
  return c.json(result);
});

campaignRoutes.post('/', zValidator('json', createCampaignSchema), async (c) => {
  const body = c.req.valid('json');
  const svc = new CampaignService(c.env.DB);
  const campaign = await svc.create(body);
  return c.json(ok(campaign), 201);
});

campaignRoutes.get('/:id', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const svc = new CampaignService(c.env.DB);
  const campaign = await svc.getById(id);
  return c.json(ok(campaign));
});

campaignRoutes.patch(
  '/:id',
  zValidator('param', idParamSchema),
  zValidator('json', updateCampaignSchema),
  async (c) => {
    const { id } = c.req.valid('param');
    const body = c.req.valid('json');
    const svc = new CampaignService(c.env.DB);
    const campaign = await svc.update(id, body);
    return c.json(ok(campaign));
  },
);

campaignRoutes.delete('/:id', zValidator('param', idParamSchema), async (c) => {
  const { id } = c.req.valid('param');
  const svc = new CampaignService(c.env.DB);
  await svc.delete(id);
  return c.json(ok(null), 200);
});
