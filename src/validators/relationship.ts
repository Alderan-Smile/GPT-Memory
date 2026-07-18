import { z } from 'zod';
import { metadataSchema } from './common.js';

export const createRelationshipSchema = z.object({
  campaignId: z.string().min(1),
  characterA: z.string().min(1),
  characterB: z.string().min(1),
  relationshipType: z.string().min(1).max(100),
  strength: z.number().min(-100).max(100).optional().default(0),
  history: z.string().max(10000).optional().nullable(),
  metadata: metadataSchema,
});

export const updateRelationshipSchema = createRelationshipSchema
  .omit({ campaignId: true })
  .partial();

export const createSecretSchema = z.object({
  campaignId: z.string().min(1),
  title: z.string().min(1).max(255),
  content: z.string().min(1).max(10000),
  revealed: z.boolean().optional().default(false),
  visibleToPlayer: z.boolean().optional().default(false),
  conditions: z.string().max(2000).optional().nullable(),
  importance: z.number().int().min(1).max(10).optional().default(5),
  relatedEntities: z
    .array(z.object({ id: z.string(), type: z.string() }))
    .optional()
    .nullable(),
  metadata: metadataSchema,
});

export const updateSecretSchema = createSecretSchema
  .omit({ campaignId: true })
  .partial();

export type CreateRelationshipInput = z.infer<typeof createRelationshipSchema>;
export type UpdateRelationshipInput = z.infer<typeof updateRelationshipSchema>;
export type CreateSecretInput = z.infer<typeof createSecretSchema>;
export type UpdateSecretInput = z.infer<typeof updateSecretSchema>;
