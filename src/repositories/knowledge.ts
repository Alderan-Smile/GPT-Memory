import { eq, isNull, and, like, sql, count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema/index.js';
import type {
  Secret, NewSecret,
  PlayerKnowledge, NewPlayerKnowledge,
  WorldKnowledge, NewWorldKnowledge,
} from '../database/schema/knowledge.js';
import { generateId } from '../utils/id.js';
import type { PaginationParams } from '../types/index.js';

export class SecretRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  constructor(d1: D1Database) { this.db = drizzle(d1, { schema }); }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { revealed?: boolean; visibleToPlayer?: boolean; includeDeleted?: boolean } = {},
  ): Promise<{ data: Secret[]; total: number }> {
    const conditions = [eq(schema.secrets.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(schema.secrets.deletedAt));
    if (filters.revealed !== undefined) conditions.push(eq(schema.secrets.revealed, filters.revealed));
    if (filters.visibleToPlayer !== undefined) conditions.push(eq(schema.secrets.visibleToPlayer, filters.visibleToPlayer));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db.select().from(schema.secrets).where(where).limit(pagination.limit).offset(pagination.offset).orderBy(schema.secrets.importance),
      this.db.select({ count: count() }).from(schema.secrets).where(where),
    ]);
    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<Secret | undefined> {
    const conditions = [eq(schema.secrets.id, id), isNull(schema.secrets.deletedAt)];
    if (campaignId) conditions.push(eq(schema.secrets.campaignId, campaignId));
    const result = await this.db.select().from(schema.secrets).where(and(...conditions)).limit(1);
    return result[0];
  }

  async create(input: Omit<NewSecret, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Secret> {
    const id = generateId();
    const now = new Date().toISOString();
    await this.db.insert(schema.secrets).values({ ...input, id, createdAt: now, updatedAt: now, version: 1 });
    return (await this.findById(id))!;
  }

  async update(id: string, campaignId: string, input: Partial<Omit<NewSecret, 'id' | 'campaignId' | 'createdAt'>>): Promise<Secret | undefined> {
    await this.db.update(schema.secrets).set({ ...input, updatedAt: new Date().toISOString(), version: sql`${schema.secrets.version} + 1` })
      .where(and(eq(schema.secrets.id, id), eq(schema.secrets.campaignId, campaignId), isNull(schema.secrets.deletedAt)));
    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db.update(schema.secrets).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(and(eq(schema.secrets.id, id), eq(schema.secrets.campaignId, campaignId), isNull(schema.secrets.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }
}

export class PlayerKnowledgeRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  constructor(d1: D1Database) { this.db = drizzle(d1, { schema }); }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { characterId?: string; category?: string; q?: string; includeDeleted?: boolean } = {},
  ): Promise<{ data: PlayerKnowledge[]; total: number }> {
    const conditions = [eq(schema.playerKnowledge.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(schema.playerKnowledge.deletedAt));
    if (filters.characterId) conditions.push(eq(schema.playerKnowledge.characterId, filters.characterId));
    if (filters.category) conditions.push(eq(schema.playerKnowledge.category, filters.category));
    if (filters.q) conditions.push(like(schema.playerKnowledge.subject, `%${filters.q}%`));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db.select().from(schema.playerKnowledge).where(where).limit(pagination.limit).offset(pagination.offset),
      this.db.select({ count: count() }).from(schema.playerKnowledge).where(where),
    ]);
    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<PlayerKnowledge | undefined> {
    const conditions = [eq(schema.playerKnowledge.id, id), isNull(schema.playerKnowledge.deletedAt)];
    if (campaignId) conditions.push(eq(schema.playerKnowledge.campaignId, campaignId));
    const result = await this.db.select().from(schema.playerKnowledge).where(and(...conditions)).limit(1);
    return result[0];
  }

  async create(input: Omit<NewPlayerKnowledge, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<PlayerKnowledge> {
    const id = generateId();
    const now = new Date().toISOString();
    await this.db.insert(schema.playerKnowledge).values({ ...input, id, createdAt: now, updatedAt: now, version: 1 });
    return (await this.findById(id))!;
  }

  async update(id: string, campaignId: string, input: Partial<Omit<NewPlayerKnowledge, 'id' | 'campaignId' | 'createdAt'>>): Promise<PlayerKnowledge | undefined> {
    await this.db.update(schema.playerKnowledge).set({ ...input, updatedAt: new Date().toISOString(), version: sql`${schema.playerKnowledge.version} + 1` })
      .where(and(eq(schema.playerKnowledge.id, id), eq(schema.playerKnowledge.campaignId, campaignId), isNull(schema.playerKnowledge.deletedAt)));
    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db.update(schema.playerKnowledge).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(and(eq(schema.playerKnowledge.id, id), eq(schema.playerKnowledge.campaignId, campaignId), isNull(schema.playerKnowledge.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }
}

export class WorldKnowledgeRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  constructor(d1: D1Database) { this.db = drizzle(d1, { schema }); }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { category?: string; q?: string; canon?: boolean; includeDeleted?: boolean } = {},
  ): Promise<{ data: WorldKnowledge[]; total: number }> {
    const conditions = [eq(schema.worldKnowledge.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(schema.worldKnowledge.deletedAt));
    if (filters.category) conditions.push(eq(schema.worldKnowledge.category, filters.category));
    if (filters.canon !== undefined) conditions.push(eq(schema.worldKnowledge.canon, filters.canon));
    if (filters.q) conditions.push(like(schema.worldKnowledge.subject, `%${filters.q}%`));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db.select().from(schema.worldKnowledge).where(where).limit(pagination.limit).offset(pagination.offset),
      this.db.select({ count: count() }).from(schema.worldKnowledge).where(where),
    ]);
    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<WorldKnowledge | undefined> {
    const conditions = [eq(schema.worldKnowledge.id, id), isNull(schema.worldKnowledge.deletedAt)];
    if (campaignId) conditions.push(eq(schema.worldKnowledge.campaignId, campaignId));
    const result = await this.db.select().from(schema.worldKnowledge).where(and(...conditions)).limit(1);
    return result[0];
  }

  async create(input: Omit<NewWorldKnowledge, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<WorldKnowledge> {
    const id = generateId();
    const now = new Date().toISOString();
    await this.db.insert(schema.worldKnowledge).values({ ...input, id, createdAt: now, updatedAt: now, version: 1 });
    return (await this.findById(id))!;
  }

  async update(id: string, campaignId: string, input: Partial<Omit<NewWorldKnowledge, 'id' | 'campaignId' | 'createdAt'>>): Promise<WorldKnowledge | undefined> {
    await this.db.update(schema.worldKnowledge).set({ ...input, updatedAt: new Date().toISOString(), version: sql`${schema.worldKnowledge.version} + 1` })
      .where(and(eq(schema.worldKnowledge.id, id), eq(schema.worldKnowledge.campaignId, campaignId), isNull(schema.worldKnowledge.deletedAt)));
    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db.update(schema.worldKnowledge).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(and(eq(schema.worldKnowledge.id, id), eq(schema.worldKnowledge.campaignId, campaignId), isNull(schema.worldKnowledge.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }
}
