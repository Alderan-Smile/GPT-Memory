import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { campaigns } from './campaigns.js';

export const quotes = sqliteTable(
  'quotes',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    author: text('author'),
    target: text('target'),
    location: text('location'),
    date: text('date'),
    text: text('text').notNull(),
    importance: integer('importance').notNull().default(5),
    context: text('context'),
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
    campaignIdx: index('quotes_campaign_idx').on(t.campaignId),
    authorIdx: index('quotes_author_idx').on(t.author),
    importanceIdx: index('quotes_importance_idx').on(t.importance),
  }),
);

export const notes = sqliteTable(
  'notes',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    title: text('title'),
    content: text('content').notNull(),
    entityType: text('entity_type'),
    entityId: text('entity_id'),
    pinned: integer('pinned', { mode: 'boolean' }).notNull().default(false),
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
    campaignIdx: index('notes_campaign_idx').on(t.campaignId),
    entityIdx: index('notes_entity_idx').on(t.entityId, t.entityType),
    pinnedIdx: index('notes_pinned_idx').on(t.pinned),
  }),
);

export const tags = sqliteTable(
  'tags',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    name: text('name').notNull(),
    color: text('color').default('#6366f1'),
    description: text('description'),
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
    campaignIdx: index('tags_campaign_idx').on(t.campaignId),
    nameIdx: index('tags_name_idx').on(t.name),
  }),
);

export const entityTags = sqliteTable(
  'entity_tags',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id),
    entityId: text('entity_id').notNull(),
    entityType: text('entity_type').notNull(),
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
    campaignIdx: index('entity_tags_campaign_idx').on(t.campaignId),
    tagIdx: index('entity_tags_tag_idx').on(t.tagId),
    entityIdx: index('entity_tags_entity_idx').on(t.entityId, t.entityType),
  }),
);

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    sessionNumber: integer('session_number').notNull(),
    title: text('title'),
    date: text('date'),
    inGameDate: text('in_game_date'),
    summary: text('summary'),
    players: text('players', { mode: 'json' }).$type<string[]>(),
    highlights: text('highlights', { mode: 'json' }).$type<string[]>(),
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
    campaignIdx: index('sessions_campaign_idx').on(t.campaignId),
    numberIdx: index('sessions_number_idx').on(t.sessionNumber),
    dateIdx: index('sessions_date_idx').on(t.date),
  }),
);

export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type EntityTag = typeof entityTags.$inferSelect;
export type NewEntityTag = typeof entityTags.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
