import { z } from 'zod';
import { metadataSchema } from './common.js';

const emotionalStats = z.object({
  trust: z.number().min(0).max(100).optional(),
  respect: z.number().min(0).max(100).optional(),
  friendship: z.number().min(0).max(100).optional(),
  fear: z.number().min(0).max(100).optional(),
  curiosity: z.number().min(0).max(100).optional(),
  anger: z.number().min(0).max(100).optional(),
  love: z.number().min(0).max(100).optional(),
  hate: z.number().min(0).max(100).optional(),
  debt: z.number().optional(),
});

export const createCharacterSchema = z
  .object({
    campaignId: z.string().min(1),
    name: z.string().min(1).max(255),
    aliases: z.array(z.string()).optional().nullable(),
    species: z.string().max(100).optional().nullable(),
    gender: z.string().max(50).optional().nullable(),
    birth: z.string().max(100).optional().nullable(),
    death: z.string().max(100).optional().nullable(),
    status: z.enum(['alive', 'dead', 'unknown', 'missing']).optional().default('alive'),
    organization: z.string().max(255).optional().nullable(),
    rank: z.string().max(100).optional().nullable(),
    currentPlanet: z.string().optional().nullable(),
    currentLocation: z.string().optional().nullable(),
    description: z.string().max(10000).optional().nullable(),
    emotionalState: z.string().max(1000).optional().nullable(),
    lastInteraction: z.string().optional().nullable(),
    metadata: metadataSchema,
  })
  .merge(emotionalStats);

export const updateCharacterSchema = createCharacterSchema
  .omit({ campaignId: true })
  .partial();

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;
