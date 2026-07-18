import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { campaigns } from './campaigns.js';

export const starSystems = sqliteTable(
  'star_systems',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    name: text('name').notNull(),
    sector: text('sector'),
    region: text('region'),
    coordinates: text('coordinates', { mode: 'json' }).$type<{
      x?: number;
      y?: number;
      z?: number;
    }>(),
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
    campaignIdx: index('star_systems_campaign_idx').on(t.campaignId),
    nameIdx: index('star_systems_name_idx').on(t.name),
  }),
);

export const planets = sqliteTable(
  'planets',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    name: text('name').notNull(),
    sector: text('sector'),
    region: text('region'),
    system: text('system').references(() => starSystems.id),
    description: text('description'),
    climate: text('climate'),
    terrain: text('terrain'),
    population: text('population'),
    government: text('government'),
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
    campaignIdx: index('planets_campaign_idx').on(t.campaignId),
    nameIdx: index('planets_name_idx').on(t.name),
    systemIdx: index('planets_system_idx').on(t.system),
  }),
);

export const locations = sqliteTable(
  'locations',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    name: text('name').notNull(),
    planet: text('planet').references(() => planets.id),
    sector: text('sector'),
    region: text('region'),
    coordinates: text('coordinates', { mode: 'json' }).$type<{
      lat?: number;
      lon?: number;
      description?: string;
    }>(),
    description: text('description'),
    type: text('type'),
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
    campaignIdx: index('locations_campaign_idx').on(t.campaignId),
    nameIdx: index('locations_name_idx').on(t.name),
    planetIdx: index('locations_planet_idx').on(t.planet),
  }),
);

export type StarSystem = typeof starSystems.$inferSelect;
export type NewStarSystem = typeof starSystems.$inferInsert;
export type Planet = typeof planets.$inferSelect;
export type NewPlanet = typeof planets.$inferInsert;
export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
