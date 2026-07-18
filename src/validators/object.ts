import { z } from 'zod';
import { metadataSchema } from './common.js';

export const createObjectSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1).max(255),
  type: z.string().max(100).optional().nullable(),
  owner: z.string().optional().nullable(),
  currentLocation: z.string().optional().nullable(),
  state: z
    .enum(['intact', 'damaged', 'destroyed', 'lost', 'unknown'])
    .optional()
    .default('intact'),
  description: z.string().max(5000).optional().nullable(),
  rarity: z
    .enum(['common', 'uncommon', 'rare', 'unique', 'legendary'])
    .optional()
    .default('common'),
  metadata: metadataSchema,
});

export const updateObjectSchema = createObjectSchema
  .omit({ campaignId: true })
  .partial();

export const createInventorySchema = z.object({
  campaignId: z.string().min(1),
  ownerId: z.string().min(1),
  ownerType: z.enum(['character', 'ship', 'vehicle', 'location']),
  objectId: z.string().min(1),
  quantity: z.number().int().min(1).optional().default(1),
  notes: z.string().max(1000).optional().nullable(),
  metadata: metadataSchema,
});

export const updateInventorySchema = createInventorySchema
  .omit({ campaignId: true, ownerId: true, ownerType: true, objectId: true })
  .partial();

export type CreateObjectInput = z.infer<typeof createObjectSchema>;
export type UpdateObjectInput = z.infer<typeof updateObjectSchema>;
export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
