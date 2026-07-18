import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { campaigns } from './campaigns.js';

export const events = sqliteTable(
  'events',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    date: text('date'),
    era: text('era'),
    planet: text('planet'),
    location: text('location'),
    summary: text('summary').notNull(),
    importance: integer('importance').notNull().default(5),
    canon: integer('canon', { mode: 'boolean' }).notNull().default(true),
    alternateCanon: integer('alternate_canon', { mode: 'boolean' })
      .notNull()
      .default(false),
    participants: text('participants', { mode: 'json' }).$type<string[]>(),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    deletedAt: text('deleted_at'),
    version: integer('version').notNull().default(1),
    metadata: text('metadata', { mode: 'json' }).$type<Record<string, unknown>>(),
  },
  (t) => ({
    campaignIdx: index('events_campaign_idx').on(t.campaignId),
    dateIdx: index('events_date_idx').on(t.date),
    importanceIdx: index('events_importance_idx').on(t.importance),
    planetIdx: index('events_planet_idx').on(t.planet),
  }),
);

export const timeline = sqliteTable(
  'timeline',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    date: text('date'),
    eventId: text('event_id').references(() => events.id),
    order: integer('order').notNull().default(0),
    label: text('label'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    deletedAt: text('deleted_at'),
    version: integer('version').notNull().default(1),
    metadata: text('metadata', { mode: 'json' }).$type<Record<string, unknown>>(),
  },
  (t) => ({
    campaignIdx: index('timeline_campaign_idx').on(t.campaignId),
    orderIdx: index('timeline_order_idx').on(t.order),
    eventIdx: index('timeline_event_idx').on(t.eventId),
  }),
);

export const relationships = sqliteTable(
  'relationships',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    characterA: text('character_a').notNull(),
    characterB: text('character_b').notNull(),
    relationshipType: text('relationship_type').notNull(),
    strength: real('strength').notNull().default(0),
    history: text('history'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text('updated_at')
      .notNull()
      .default(sql`(datetime('now'))`),
    deletedAt: text('deleted_at'),
    version: integer('version').notNull().default(1),
    metadata: text('metadata', { mode: 'json' }).$type<Record<string, unknown>>(),
  },
  (t) => ({
    campaignIdx: index('relationships_campaign_idx').on(t.campaignId),
    charAIdx: index('relationships_char_a_idx').on(t.characterA),
    charBIdx: index('relationships_char_b_idx').on(t.characterB),
    typeIdx: index('relationships_type_idx').on(t.relationshipType),
  }),
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Timeline = typeof timeline.$inferSelect;
export type NewTimeline = typeof timeline.$inferInsert;
export type Relationship = typeof relationships.$inferSelect;
export type NewRelationship = typeof relationships.$inferInsert;
