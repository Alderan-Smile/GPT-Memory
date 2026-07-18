import { z } from 'zod';
import { metadataSchema } from './common.js';

export const createCampaignSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  metadata: metadataSchema,
});

export const updateCampaignSchema = createCampaignSchema.partial();

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
