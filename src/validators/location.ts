import { z } from 'zod';
import { metadataSchema } from './common.js';

const coordinatesSchema = z
  .object({
    lat: z.number().optional(),
    lon: z.number().optional(),
    x: z.number().optional(),
    y: z.number().optional(),
    z: z.number().optional(),
    description: z.string().optional(),
  })
  .optional()
  .nullable();

export const createStarSystemSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1).max(255),
  sector: z.string().max(100).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  coordinates: coordinatesSchema,
  description: z.string().max(5000).optional().nullable(),
  metadata: metadataSchema,
});

export const updateStarSystemSchema = createStarSystemSchema
  .omit({ campaignId: true })
  .partial();

export const createPlanetSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1).max(255),
  sector: z.string().max(100).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  system: z.string().optional().nullable(),
  description: z.string().max(5000).optional().nullable(),
  climate: z.string().max(200).optional().nullable(),
  terrain: z.string().max(200).optional().nullable(),
  population: z.string().max(100).optional().nullable(),
  government: z.string().max(255).optional().nullable(),
  metadata: metadataSchema,
});

export const updatePlanetSchema = createPlanetSchema
  .omit({ campaignId: true })
  .partial();

export const createLocationSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1).max(255),
  planet: z.string().optional().nullable(),
  sector: z.string().max(100).optional().nullable(),
  region: z.string().max(100).optional().nullable(),
  coordinates: coordinatesSchema,
  description: z.string().max(5000).optional().nullable(),
  type: z.string().max(100).optional().nullable(),
  metadata: metadataSchema,
});

export const updateLocationSchema = createLocationSchema
  .omit({ campaignId: true })
  .partial();

export type CreateStarSystemInput = z.infer<typeof createStarSystemSchema>;
export type UpdateStarSystemInput = z.infer<typeof updateStarSystemSchema>;
export type CreatePlanetInput = z.infer<typeof createPlanetSchema>;
export type UpdatePlanetInput = z.infer<typeof updatePlanetSchema>;
export type CreateLocationInput = z.infer<typeof createLocationSchema>;
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;
