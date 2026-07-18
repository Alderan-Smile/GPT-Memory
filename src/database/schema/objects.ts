import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { campaigns } from './campaigns.js';

export const objects = sqliteTable(
  'objects',
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
      enum: ['intact', 'damaged', 'destroyed', 'lost', 'unknown'],
    }).default('intact'),
    description: text('description'),
    rarity: text('rarity', {
      enum: ['common', 'uncommon', 'rare', 'unique', 'legendary'],
    }).default('common'),
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
    campaignIdx: index('objects_campaign_idx').on(t.campaignId),
    nameIdx: index('objects_name_idx').on(t.name),
    ownerIdx: index('objects_owner_idx').on(t.owner),
    typeIdx: index('objects_type_idx').on(t.type),
  }),
);

export const inventory = sqliteTable(
  'inventory',
  {
    id: text('id').primaryKey(),
    campaignId: text('campaign_id')
      .notNull()
      .references(() => campaigns.id),
    ownerId: text('owner_id').notNull(),
    ownerType: text('owner_type', {
      enum: ['character', 'ship', 'vehicle', 'location'],
    }).notNull(),
    objectId: text('object_id')
      .notNull()
      .references(() => objects.id),
    quantity: integer('quantity').notNull().default(1),
    notes: text('notes'),
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
    campaignIdx: index('inventory_campaign_idx').on(t.campaignId),
    ownerIdx: index('inventory_owner_idx').on(t.ownerId, t.ownerType),
    objectIdx: index('inventory_object_idx').on(t.objectId),
  }),
);

export type DBObject = typeof objects.$inferSelect;
export type NewDBObject = typeof objects.$inferInsert;
export type Inventory = typeof inventory.$inferSelect;
export type NewInventory = typeof inventory.$inferInsert;
