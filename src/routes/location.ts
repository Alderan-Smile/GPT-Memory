import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z, type ZodObject, type ZodRawShape } from 'zod';
import type { AppContext } from '../types/index.js';
import { LocationService, PlanetService, StarSystemService } from '../services/location.js';
import {
  createLocationSchema, updateLocationSchema,
  createPlanetSchema, updatePlanetSchema,
  createStarSystemSchema, updateStarSystemSchema,
} from '../validators/location.js';
import { listQuerySchema, idParamSchema } from '../validators/common.js';
import { ok } from '../utils/response.js';

const withCampaign = z.object({ campaignId: z.string().min(1) });

function makeRoutes<TCreate extends object, TUpdate extends object>(
  Service: new (d1: D1Database) => {
    list(c: string, p: Record<string, unknown>): Promise<unknown>;
    getById(id: string, c: string): Promise<unknown>;
    create(i: TCreate): Promise<unknown>;
    update(id: string, c: string, i: TUpdate): Promise<unknown>;
    delete(id: string, c: string): Promise<void>;
  },
  createSchema: ZodObject<ZodRawShape>,
  updateSchema: ZodObject<ZodRawShape>,
) {
  const router = new Hono<AppContext>();
  const listSchema = listQuerySchema.merge(withCampaign);

  router.get('/', zValidator('query', listSchema), async (c) => {
    const query = c.req.valid('query');
    const svc = new Service(c.env.DB);
    const result = await svc.list(query.campaignId, query);
    return c.json(result);
  });

  router.post('/', zValidator('json', createSchema), async (c) => {
    const body = c.req.valid('json') as TCreate;
    const svc = new Service(c.env.DB);
    const item = await svc.create(body);
    return c.json(ok(item), 201);
  });

  router.get('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
    const { id } = c.req.valid('param');
    const { campaignId } = c.req.valid('query');
    const svc = new Service(c.env.DB);
    const item = await svc.getById(id, campaignId);
    return c.json(ok(item));
  });

  router.patch(
    '/:id',
    zValidator('param', idParamSchema),
    zValidator('json', updateSchema.merge(withCampaign)),
    async (c) => {
      const { id } = c.req.valid('param');
      const { campaignId, ...body } = c.req.valid('json') as { campaignId: string } & TUpdate;
      const svc = new Service(c.env.DB);
      const item = await svc.update(id, campaignId, body as TUpdate);
      return c.json(ok(item));
    },
  );

  router.delete('/:id', zValidator('param', idParamSchema), zValidator('query', withCampaign), async (c) => {
    const { id } = c.req.valid('param');
    const { campaignId } = c.req.valid('query');
    const svc = new Service(c.env.DB);
    await svc.delete(id, campaignId);
    return c.json(ok(null), 200);
  });

  return router;
}

export const locationRoutes = makeRoutes(LocationService, createLocationSchema, updateLocationSchema);
export const planetRoutes = makeRoutes(PlanetService, createPlanetSchema, updatePlanetSchema);
export const starSystemRoutes = makeRoutes(StarSystemService, createStarSystemSchema, updateStarSystemSchema);
