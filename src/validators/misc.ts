import { z } from 'zod';
import { metadataSchema } from './common.js';

export const createQuoteSchema = z.object({
  campaignId: z.string().min(1),
  author: z.string().max(255).optional().nullable(),
  target: z.string().max(255).optional().nullable(),
  location: z.string().optional().nullable(),
  date: z.string().optional().nullable(),
  text: z.string().min(1).max(5000),
  importance: z.number().int().min(1).max(10).optional().default(5),
  context: z.string().max(2000).optional().nullable(),
  metadata: metadataSchema,
});

export const updateQuoteSchema = createQuoteSchema
  .omit({ campaignId: true })
  .partial();

export const createNoteSchema = z.object({
  campaignId: z.string().min(1),
  title: z.string().max(255).optional().nullable(),
  content: z.string().min(1).max(50000),
  entityType: z.string().max(50).optional().nullable(),
  entityId: z.string().optional().nullable(),
  pinned: z.boolean().optional().default(false),
  metadata: metadataSchema,
});

export const updateNoteSchema = createNoteSchema
  .omit({ campaignId: true })
  .partial();

export const createTagSchema = z.object({
  campaignId: z.string().min(1),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional().default('#6366f1'),
  description: z.string().max(500).optional().nullable(),
  metadata: metadataSchema,
});

export const updateTagSchema = createTagSchema
  .omit({ campaignId: true })
  .partial();

export const createSessionSchema = z.object({
  campaignId: z.string().min(1),
  sessionNumber: z.number().int().min(1),
  title: z.string().max(255).optional().nullable(),
  date: z.string().optional().nullable(),
  inGameDate: z.string().optional().nullable(),
  summary: z.string().max(10000).optional().nullable(),
  players: z.array(z.string()).optional().nullable(),
  highlights: z.array(z.string()).optional().nullable(),
  metadata: metadataSchema,
});

export const updateSessionSchema = createSessionSchema
  .omit({ campaignId: true })
  .partial();

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
export type UpdateQuoteInput = z.infer<typeof updateQuoteSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
export type UpdateSessionInput = z.infer<typeof updateSessionSchema>;
