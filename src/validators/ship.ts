import { z } from 'zod';
import { metadataSchema } from './common.js';

export const createShipSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1).max(255),
  class: z.string().max(100).optional().nullable(),
  captain: z.string().optional().nullable(),
  crew: z.array(z.string()).optional().nullable(),
  currentLocation: z.string().optional().nullable(),
  state: z
    .enum(['operational', 'damaged', 'destroyed', 'docked', 'in_transit'])
    .optional()
    .default('operational'),
  description: z.string().max(5000).optional().nullable(),
  manufacturer: z.string().max(255).optional().nullable(),
  metadata: metadataSchema,
});

export const updateShipSchema = createShipSchema
  .omit({ campaignId: true })
  .partial();

export const createVehicleSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1).max(255),
  type: z.string().max(100).optional().nullable(),
  owner: z.string().optional().nullable(),
  currentLocation: z.string().optional().nullable(),
  state: z
    .enum(['operational', 'damaged', 'destroyed', 'stored'])
    .optional()
    .default('operational'),
  description: z.string().max(5000).optional().nullable(),
  manufacturer: z.string().max(255).optional().nullable(),
  metadata: metadataSchema,
});

export const updateVehicleSchema = createVehicleSchema
  .omit({ campaignId: true })
  .partial();

export type CreateShipInput = z.infer<typeof createShipSchema>;
export type UpdateShipInput = z.infer<typeof updateShipSchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
