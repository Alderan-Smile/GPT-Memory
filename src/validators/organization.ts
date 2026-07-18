import { z } from 'zod';
import { metadataSchema } from './common.js';

export const createOrganizationSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1).max(255),
  description: z.string().max(5000).optional().nullable(),
  leader: z.string().optional().nullable(),
  type: z.string().max(100).optional().nullable(),
  alignment: z.string().max(100).optional().nullable(),
  headquarters: z.string().optional().nullable(),
  metadata: metadataSchema,
});

export const updateOrganizationSchema = createOrganizationSchema
  .omit({ campaignId: true })
  .partial();

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
