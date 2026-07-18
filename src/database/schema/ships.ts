import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { campaigns } from './campaigns.js';

export const ships = sqliteTable(
  'ships',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    name: text('name').notNull(),
    class: text('class'),
    captain: text('captain'),
    crew: text('crew', { mode: 'json' }).$type<string[]>(),
    currentLocation: text('current_location'),
    state: text('state', {
      enum: ['operational', 'damaged', 'destroyed', 'docked', 'in_transit'],
    }).default('operational'),
    description: text('description'),
    manufacturer: text('manufacturer'),
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
    campaignIdx: index('ships_campaign_idx').on(t.campaignId),
    nameIdx: index('ships_name_idx').on(t.name),
    captainIdx: index('ships_captain_idx').on(t.captain),
  }),
);

export const vehicles = sqliteTable(
  'vehicles',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    name: text('name').notNull(),
    type: text('type'),
    owner: text('owner'),
    currentLocation: text('current_location'),
    state: text('state', {
      enum: ['operational', 'damaged', 'destroyed', 'stored'],
    }).default('operational'),
    description: text('description'),
    manufacturer: text('manufacturer'),
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
    campaignIdx: index('vehicles_campaign_idx').on(t.campaignId),
    ownerIdx: index('vehicles_owner_idx').on(t.owner),
  }),
);

export type Ship = typeof ships.$inferSelect;
export type NewShip = typeof ships.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
