import { z } from 'zod';

export const searchQuerySchema = z.object({
  q: z.string().min(1).max(500),
  campaignId: z.string().optional(),
  types: z
    .string()
    .transform((v) => v.split(',').map((s) => s.trim()))
    .optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  tags: z
    .string()
    .transform((v) => v.split(',').map((s) => s.trim()))
    .optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const contextQuerySchema = z.object({
  campaignId: z.string().min(1),
  planet: z.string().optional(),
  location: z.string().optional(),
  date: z.string().optional(),
  characters: z
    .string()
    .transform((v) => v.split(',').map((s) => s.trim()))
    .optional(),
  radius: z.coerce.number().optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type ContextQuery = z.infer<typeof contextQuerySchema>;
