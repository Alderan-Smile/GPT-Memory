import { z } from 'zod';
import { metadataSchema } from './common.js';

export const createEventSchema = z.object({
  campaignId: z.string().min(1),
  date: z.string().optional().nullable(),
  era: z.string().max(100).optional().nullable(),
  planet: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  summary: z.string().min(1).max(10000),
  importance: z.number().int().min(1).max(10).optional().default(5),
  canon: z.boolean().optional().default(true),
  alternateCanon: z.boolean().optional().default(false),
  participants: z.array(z.string()).optional().nullable(),
  metadata: metadataSchema,
});

export const updateEventSchema = createEventSchema
  .omit({ campaignId: true })
  .partial();

export const createTimelineSchema = z.object({
  campaignId: z.string().min(1),
  date: z.string().optional().nullable(),
  eventId: z.string().optional().nullable(),
  order: z.number().int().optional().default(0),
  label: z.string().max(255).optional().nullable(),
  metadata: metadataSchema,
});

export const updateTimelineSchema = createTimelineSchema
  .omit({ campaignId: true })
  .partial();

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type CreateTimelineInput = z.infer<typeof createTimelineSchema>;
export type UpdateTimelineInput = z.infer<typeof updateTimelineSchema>;
