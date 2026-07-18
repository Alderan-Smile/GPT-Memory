import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { campaigns } from './campaigns.js';

export const secrets = sqliteTable(
  'secrets',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    title: text('title').notNull(),
    content: text('content').notNull(),
    revealed: integer('revealed', { mode: 'boolean' }).notNull().default(false),
    visibleToPlayer: integer('visible_to_player', { mode: 'boolean' })
      .notNull()
      .default(false),
    conditions: text('conditions'),
    importance: integer('importance').notNull().default(5),
    relatedEntities: text('related_entities', { mode: 'json' }).$type<
      Array<{ id: string; type: string }>
    >(),
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
    campaignIdx: index('secrets_campaign_idx').on(t.campaignId),
    revealedIdx: index('secrets_revealed_idx').on(t.revealed),
    importanceIdx: index('secrets_importance_idx').on(t.importance),
  }),
);

export const playerKnowledge = sqliteTable(
  'player_knowledge',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    characterId: text('character_id'),
    subject: text('subject').notNull(),
    content: text('content').notNull(),
    source: text('source'),
    certainty: real('certainty').notNull().default(100),
    category: text('category'),
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
    campaignIdx: index('player_knowledge_campaign_idx').on(t.campaignId),
    characterIdx: index('player_knowledge_character_idx').on(t.characterId),
    subjectIdx: index('player_knowledge_subject_idx').on(t.subject),
  }),
);

export const worldKnowledge = sqliteTable(
  'world_knowledge',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    subject: text('subject').notNull(),
    content: text('content').notNull(),
    category: text('category'),
    canon: integer('canon', { mode: 'boolean' }).notNull().default(true),
    sources: text('sources', { mode: 'json' }).$type<string[]>(),
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
    campaignIdx: index('world_knowledge_campaign_idx').on(t.campaignId),
    subjectIdx: index('world_knowledge_subject_idx').on(t.subject),
    categoryIdx: index('world_knowledge_category_idx').on(t.category),
  }),
);

export type Secret = typeof secrets.$inferSelect;
export type NewSecret = typeof secrets.$inferInsert;
export type PlayerKnowledge = typeof playerKnowledge.$inferSelect;
export type NewPlayerKnowledge = typeof playerKnowledge.$inferInsert;
export type WorldKnowledge = typeof worldKnowledge.$inferSelect;
export type NewWorldKnowledge = typeof worldKnowledge.$inferInsert;
