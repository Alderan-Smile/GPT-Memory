import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { AppContext } from "../types/index.js";
import { OrganizationService, ShipService, VehicleService, ObjectService } from "../services/entities.js";
import { createOrganizationSchema, updateOrganizationSchema } from "../validators/organization.js";
import { createShipSchema, updateShipSchema, createVehicleSchema, updateVehicleSchema } from "../validators/ship.js";
import { createObjectSchema, updateObjectSchema } from "../validators/object.js";
import { listQuerySchema, idParamSchema } from "../validators/common.js";
import { ok } from "../utils/response.js";

const withCampaign = z.object({ campaignId: z.string().min(1) });

/* eslint-disable @typescript-eslint/no-explicit-any */
export const organizationRoutes = new Hono<AppContext>();
organizationRoutes.get("/", zValidator("query", listQuerySchema.merge(withCampaign)), async (c) => { const q = c.req.valid("query"); return c.json(await new OrganizationService(c.env.DB).list(q.campaignId, q)); });
organizationRoutes.post("/", zValidator("json", createOrganizationSchema), async (c) => { return c.json(ok(await new OrganizationService(c.env.DB).create(c.req.valid("json") as any)), 201); });
organizationRoutes.get("/:id", zValidator("param", idParamSchema), zValidator("query", withCampaign), async (c) => { const { id } = c.req.valid("param"); const { campaignId } = c.req.valid("query"); return c.json(ok(await new OrganizationService(c.env.DB).getById(id, campaignId))); });
organizationRoutes.patch("/:id", zValidator("param", idParamSchema), zValidator("json", updateOrganizationSchema.merge(withCampaign)), async (c) => { const { id } = c.req.valid("param"); const { campaignId, ...body } = c.req.valid("json"); return c.json(ok(await new OrganizationService(c.env.DB).update(id, campaignId, body as any))); });
organizationRoutes.delete("/:id", zValidator("param", idParamSchema), zValidator("query", withCampaign), async (c) => { const { id } = c.req.valid("param"); const { campaignId } = c.req.valid("query"); await new OrganizationService(c.env.DB).delete(id, campaignId); return c.json(ok(null), 200); });

export const shipRoutes = new Hono<AppContext>();
shipRoutes.get("/", zValidator("query", listQuerySchema.merge(withCampaign)), async (c) => { const q = c.req.valid("query"); return c.json(await new ShipService(c.env.DB).list(q.campaignId, q)); });
shipRoutes.post("/", zValidator("json", createShipSchema), async (c) => { return c.json(ok(await new ShipService(c.env.DB).create(c.req.valid("json") as any)), 201); });
shipRoutes.get("/:id", zValidator("param", idParamSchema), zValidator("query", withCampaign), async (c) => { const { id } = c.req.valid("param"); const { campaignId } = c.req.valid("query"); return c.json(ok(await new ShipService(c.env.DB).getById(id, campaignId))); });
shipRoutes.patch("/:id", zValidator("param", idParamSchema), zValidator("json", updateShipSchema.merge(withCampaign)), async (c) => { const { id } = c.req.valid("param"); const { campaignId, ...body } = c.req.valid("json"); return c.json(ok(await new ShipService(c.env.DB).update(id, campaignId, body as any))); });
shipRoutes.delete("/:id", zValidator("param", idParamSchema), zValidator("query", withCampaign), async (c) => { const { id } = c.req.valid("param"); const { campaignId } = c.req.valid("query"); await new ShipService(c.env.DB).delete(id, campaignId); return c.json(ok(null), 200); });

export const vehicleRoutes = new Hono<AppContext>();
vehicleRoutes.get("/", zValidator("query", listQuerySchema.merge(withCampaign)), async (c) => { const q = c.req.valid("query"); return c.json(await new VehicleService(c.env.DB).list(q.campaignId, q)); });
vehicleRoutes.post("/", zValidator("json", createVehicleSchema), async (c) => { return c.json(ok(await new VehicleService(c.env.DB).create(c.req.valid("json") as any)), 201); });
vehicleRoutes.get("/:id", zValidator("param", idParamSchema), zValidator("query", withCampaign), async (c) => { const { id } = c.req.valid("param"); const { campaignId } = c.req.valid("query"); return c.json(ok(await new VehicleService(c.env.DB).getById(id, campaignId))); });
vehicleRoutes.patch("/:id", zValidator("param", idParamSchema), zValidator("json", updateVehicleSchema.merge(withCampaign)), async (c) => { const { id } = c.req.valid("param"); const { campaignId, ...body } = c.req.valid("json"); return c.json(ok(await new VehicleService(c.env.DB).update(id, campaignId, body as any))); });
vehicleRoutes.delete("/:id", zValidator("param", idParamSchema), zValidator("query", withCampaign), async (c) => { const { id } = c.req.valid("param"); const { campaignId } = c.req.valid("query"); await new VehicleService(c.env.DB).delete(id, campaignId); return c.json(ok(null), 200); });

export const objectRoutes = new Hono<AppContext>();
objectRoutes.get("/", zValidator("query", listQuerySchema.merge(withCampaign)), async (c) => { const q = c.req.valid("query"); return c.json(await new ObjectService(c.env.DB).list(q.campaignId, q)); });
objectRoutes.post("/", zValidator("json", createObjectSchema), async (c) => { return c.json(ok(await new ObjectService(c.env.DB).create(c.req.valid("json") as any)), 201); });
objectRoutes.get("/:id", zValidator("param", idParamSchema), zValidator("query", withCampaign), async (c) => { const { id } = c.req.valid("param"); const { campaignId } = c.req.valid("query"); return c.json(ok(await new ObjectService(c.env.DB).getById(id, campaignId))); });
objectRoutes.patch("/:id", zValidator("param", idParamSchema), zValidator("json", updateObjectSchema.merge(withCampaign)), async (c) => { const { id } = c.req.valid("param"); const { campaignId, ...body } = c.req.valid("json"); return c.json(ok(await new ObjectService(c.env.DB).update(id, campaignId, body as any))); });
objectRoutes.delete("/:id", zValidator("param", idParamSchema), zValidator("query", withCampaign), async (c) => { const { id } = c.req.valid("param"); const { campaignId } = c.req.valid("query"); await new ObjectService(c.env.DB).delete(id, campaignId); return c.json(ok(null), 200); });
