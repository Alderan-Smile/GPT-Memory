import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { campaigns } from './campaigns.js';

export const species = sqliteTable(
  'species',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    name: text('name').notNull(),
    description: text('description'),
    homeworld: text('homeworld'),
    traits: text('traits', { mode: 'json' }).$type<string[]>(),
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
    campaignIdx: index('species_campaign_idx').on(t.campaignId),
    nameIdx: index('species_name_idx').on(t.name),
  }),
);

export const characters = sqliteTable(
  'characters',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    name: text('name').notNull(),
    aliases: text('aliases', { mode: 'json' }).$type<string[]>(),
    species: text('species'),
    gender: text('gender'),
    birth: text('birth'),
    death: text('death'),
    status: text('status', {
      enum: ['alive', 'dead', 'unknown', 'missing'],
    })
      .notNull()
      .default('alive'),
    organization: text('organization'),
    rank: text('rank'),
    currentPlanet: text('current_planet'),
    currentLocation: text('current_location'),
    description: text('description'),
    emotionalState: text('emotional_state'),
    trust: real('trust').default(50),
    respect: real('respect').default(50),
    friendship: real('friendship').default(50),
    fear: real('fear').default(0),
    curiosity: real('curiosity').default(50),
    anger: real('anger').default(0),
    love: real('love').default(0),
    hate: real('hate').default(0),
    debt: real('debt').default(0),
    lastInteraction: text('last_interaction'),
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
    campaignIdx: index('characters_campaign_idx').on(t.campaignId),
    nameIdx: index('characters_name_idx').on(t.name),
    statusIdx: index('characters_status_idx').on(t.status),
    planetIdx: index('characters_planet_idx').on(t.currentPlanet),
    locationIdx: index('characters_location_idx').on(t.currentLocation),
  }),
);

export type Species = typeof species.$inferSelect;
export type NewSpecies = typeof species.$inferInsert;
export type Character = typeof characters.$inferSelect;
export type NewCharacter = typeof characters.$inferInsert;
