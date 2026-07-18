import { eq, isNull, and, like, sql, count, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema/index.js';
import type { Event, NewEvent, Timeline, NewTimeline, Relationship, NewRelationship } from '../database/schema/events.js';
import { generateId } from '../utils/id.js';
import type { PaginationParams } from '../types/index.js';

export class EventRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  constructor(d1: D1Database) { this.db = drizzle(d1, { schema }); }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { q?: string; planet?: string; era?: string; includeDeleted?: boolean } = {},
  ): Promise<{ data: Event[]; total: number }> {
    const conditions = [eq(schema.events.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(schema.events.deletedAt));
    if (filters.q) conditions.push(like(schema.events.summary, `%${filters.q}%`));
    if (filters.planet) conditions.push(eq(schema.events.planet, filters.planet));
    if (filters.era) conditions.push(eq(schema.events.era, filters.era));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db.select().from(schema.events).where(where).limit(pagination.limit).offset(pagination.offset).orderBy(schema.events.date),
      this.db.select({ count: count() }).from(schema.events).where(where),
    ]);
    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<Event | undefined> {
    const conditions = [eq(schema.events.id, id), isNull(schema.events.deletedAt)];
    if (campaignId) conditions.push(eq(schema.events.campaignId, campaignId));
    const result = await this.db.select().from(schema.events).where(and(...conditions)).limit(1);
    return result[0];
  }

  async findNearDate(campaignId: string, date: string, limit: number): Promise<Event[]> {
    return this.db.select().from(schema.events)
      .where(and(eq(schema.events.campaignId, campaignId), isNull(schema.events.deletedAt)))
      .orderBy(schema.events.date)
      .limit(limit);
  }

  async create(input: Omit<NewEvent, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Event> {
    const id = generateId();
    const now = new Date().toISOString();
    await this.db.insert(schema.events).values({ ...input, id, createdAt: now, updatedAt: now, version: 1 });
    return (await this.findById(id))!;
  }

  async update(id: string, campaignId: string, input: Partial<Omit<NewEvent, 'id' | 'campaignId' | 'createdAt'>>): Promise<Event | undefined> {
    await this.db.update(schema.events).set({ ...input, updatedAt: new Date().toISOString(), version: sql`${schema.events.version} + 1` })
      .where(and(eq(schema.events.id, id), eq(schema.events.campaignId, campaignId), isNull(schema.events.deletedAt)));
    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db.update(schema.events).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(and(eq(schema.events.id, id), eq(schema.events.campaignId, campaignId), isNull(schema.events.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }
}

export class TimelineRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  constructor(d1: D1Database) { this.db = drizzle(d1, { schema }); }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { includeDeleted?: boolean } = {},
  ): Promise<{ data: Timeline[]; total: number }> {
    const conditions = [eq(schema.timeline.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(schema.timeline.deletedAt));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db.select().from(schema.timeline).where(where).limit(pagination.limit).offset(pagination.offset).orderBy(schema.timeline.order),
      this.db.select({ count: count() }).from(schema.timeline).where(where),
    ]);
    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<Timeline | undefined> {
    const conditions = [eq(schema.timeline.id, id), isNull(schema.timeline.deletedAt)];
    if (campaignId) conditions.push(eq(schema.timeline.campaignId, campaignId));
    const result = await this.db.select().from(schema.timeline).where(and(...conditions)).limit(1);
    return result[0];
  }

  async create(input: Omit<NewTimeline, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Timeline> {
    const id = generateId();
    const now = new Date().toISOString();
    await this.db.insert(schema.timeline).values({ ...input, id, createdAt: now, updatedAt: now, version: 1 });
    return (await this.findById(id))!;
  }

  async update(id: string, campaignId: string, input: Partial<Omit<NewTimeline, 'id' | 'campaignId' | 'createdAt'>>): Promise<Timeline | undefined> {
    await this.db.update(schema.timeline).set({ ...input, updatedAt: new Date().toISOString(), version: sql`${schema.timeline.version} + 1` })
      .where(and(eq(schema.timeline.id, id), eq(schema.timeline.campaignId, campaignId), isNull(schema.timeline.deletedAt)));
    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db.update(schema.timeline).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(and(eq(schema.timeline.id, id), eq(schema.timeline.campaignId, campaignId), isNull(schema.timeline.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }
}

export class RelationshipRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  constructor(d1: D1Database) { this.db = drizzle(d1, { schema }); }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { characterId?: string; type?: string; includeDeleted?: boolean } = {},
  ): Promise<{ data: Relationship[]; total: number }> {
    const conditions = [eq(schema.relationships.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(schema.relationships.deletedAt));
    if (filters.characterId) {
      conditions.push(or(
        eq(schema.relationships.characterA, filters.characterId),
        eq(schema.relationships.characterB, filters.characterId),
      )!);
    }
    if (filters.type) conditions.push(eq(schema.relationships.relationshipType, filters.type));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db.select().from(schema.relationships).where(where).limit(pagination.limit).offset(pagination.offset),
      this.db.select({ count: count() }).from(schema.relationships).where(where),
    ]);
    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<Relationship | undefined> {
    const conditions = [eq(schema.relationships.id, id), isNull(schema.relationships.deletedAt)];
    if (campaignId) conditions.push(eq(schema.relationships.campaignId, campaignId));
    const result = await this.db.select().from(schema.relationships).where(and(...conditions)).limit(1);
    return result[0];
  }

  async findByCharacter(campaignId: string, characterId: string): Promise<Relationship[]> {
    return this.db.select().from(schema.relationships)
      .where(and(
        eq(schema.relationships.campaignId, campaignId),
        isNull(schema.relationships.deletedAt),
        or(
          eq(schema.relationships.characterA, characterId),
          eq(schema.relationships.characterB, characterId),
        ),
      ));
  }

  async create(input: Omit<NewRelationship, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Relationship> {
    const id = generateId();
    const now = new Date().toISOString();
    await this.db.insert(schema.relationships).values({ ...input, id, createdAt: now, updatedAt: now, version: 1 });
    return (await this.findById(id))!;
  }

  async update(id: string, campaignId: string, input: Partial<Omit<NewRelationship, 'id' | 'campaignId' | 'createdAt'>>): Promise<Relationship | undefined> {
    await this.db.update(schema.relationships).set({ ...input, updatedAt: new Date().toISOString(), version: sql`${schema.relationships.version} + 1` })
      .where(and(eq(schema.relationships.id, id), eq(schema.relationships.campaignId, campaignId), isNull(schema.relationships.deletedAt)));
    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db.update(schema.relationships).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(and(eq(schema.relationships.id, id), eq(schema.relationships.campaignId, campaignId), isNull(schema.relationships.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }
}
