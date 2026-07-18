import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const sortSchema = z.object({
  sortBy: z.string().optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const campaignIdSchema = z.object({
  campaignId: z.string().uuid('campaignId must be a valid UUID'),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export const metadataSchema = z
  .record(z.unknown())
  .optional()
  .nullable();

export const listQuerySchema = paginationSchema.merge(sortSchema).extend({
  campaignId: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional().default(false),
  q: z.string().optional(),
});
