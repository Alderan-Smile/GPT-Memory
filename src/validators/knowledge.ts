import { z } from 'zod';
import { metadataSchema } from './common.js';

export const createPlayerKnowledgeSchema = z.object({
  campaignId: z.string().min(1),
  characterId: z.string().optional().nullable(),
  subject: z.string().min(1).max(255),
  content: z.string().min(1).max(10000),
  source: z.string().max(500).optional().nullable(),
  certainty: z.number().min(0).max(100).optional().default(100),
  category: z.string().max(100).optional().nullable(),
  metadata: metadataSchema,
});

export const updatePlayerKnowledgeSchema = createPlayerKnowledgeSchema
  .omit({ campaignId: true })
  .partial();

export const createWorldKnowledgeSchema = z.object({
  campaignId: z.string().min(1),
  subject: z.string().min(1).max(255),
  content: z.string().min(1).max(10000),
  category: z.string().max(100).optional().nullable(),
  canon: z.boolean().optional().default(true),
  sources: z.array(z.string()).optional().nullable(),
  metadata: metadataSchema,
});

export const updateWorldKnowledgeSchema = createWorldKnowledgeSchema
  .omit({ campaignId: true })
  .partial();

export type CreatePlayerKnowledgeInput = z.infer<typeof createPlayerKnowledgeSchema>;
export type UpdatePlayerKnowledgeInput = z.infer<typeof updatePlayerKnowledgeSchema>;
export type CreateWorldKnowledgeInput = z.infer<typeof createWorldKnowledgeSchema>;
export type UpdateWorldKnowledgeInput = z.infer<typeof updateWorldKnowledgeSchema>;
