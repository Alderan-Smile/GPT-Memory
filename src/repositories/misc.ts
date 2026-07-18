import { eq, isNull, and, like, sql, count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema/index.js';
import type { Quote, NewQuote, Note, NewNote, Session, NewSession } from '../database/schema/misc.js';
import { generateId } from '../utils/id.js';
import type { PaginationParams } from '../types/index.js';

export class QuoteRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  constructor(d1: D1Database) { this.db = drizzle(d1, { schema }); }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { author?: string; q?: string; includeDeleted?: boolean } = {},
  ): Promise<{ data: Quote[]; total: number }> {
    const conditions = [eq(schema.quotes.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(schema.quotes.deletedAt));
    if (filters.author) conditions.push(eq(schema.quotes.author, filters.author));
    if (filters.q) conditions.push(like(schema.quotes.text, `%${filters.q}%`));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db.select().from(schema.quotes).where(where).limit(pagination.limit).offset(pagination.offset).orderBy(schema.quotes.importance),
      this.db.select({ count: count() }).from(schema.quotes).where(where),
    ]);
    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<Quote | undefined> {
    const conditions = [eq(schema.quotes.id, id), isNull(schema.quotes.deletedAt)];
    if (campaignId) conditions.push(eq(schema.quotes.campaignId, campaignId));
    const result = await this.db.select().from(schema.quotes).where(and(...conditions)).limit(1);
    return result[0];
  }

  async create(input: Omit<NewQuote, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Quote> {
    const id = generateId();
    const now = new Date().toISOString();
    await this.db.insert(schema.quotes).values({ ...input, id, createdAt: now, updatedAt: now, version: 1 });
    return (await this.findById(id))!;
  }

  async update(id: string, campaignId: string, input: Partial<Omit<NewQuote, 'id' | 'campaignId' | 'createdAt'>>): Promise<Quote | undefined> {
    await this.db.update(schema.quotes).set({ ...input, updatedAt: new Date().toISOString(), version: sql`${schema.quotes.version} + 1` })
      .where(and(eq(schema.quotes.id, id), eq(schema.quotes.campaignId, campaignId), isNull(schema.quotes.deletedAt)));
    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db.update(schema.quotes).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(and(eq(schema.quotes.id, id), eq(schema.quotes.campaignId, campaignId), isNull(schema.quotes.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }
}

export class NoteRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  constructor(d1: D1Database) { this.db = drizzle(d1, { schema }); }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { entityId?: string; entityType?: string; pinned?: boolean; q?: string; includeDeleted?: boolean } = {},
  ): Promise<{ data: Note[]; total: number }> {
    const conditions = [eq(schema.notes.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(schema.notes.deletedAt));
    if (filters.entityId) conditions.push(eq(schema.notes.entityId, filters.entityId));
    if (filters.entityType) conditions.push(eq(schema.notes.entityType, filters.entityType));
    if (filters.pinned !== undefined) conditions.push(eq(schema.notes.pinned, filters.pinned));
    if (filters.q) conditions.push(like(schema.notes.content, `%${filters.q}%`));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db.select().from(schema.notes).where(where).limit(pagination.limit).offset(pagination.offset).orderBy(schema.notes.createdAt),
      this.db.select({ count: count() }).from(schema.notes).where(where),
    ]);
    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<Note | undefined> {
    const conditions = [eq(schema.notes.id, id), isNull(schema.notes.deletedAt)];
    if (campaignId) conditions.push(eq(schema.notes.campaignId, campaignId));
    const result = await this.db.select().from(schema.notes).where(and(...conditions)).limit(1);
    return result[0];
  }

  async create(input: Omit<NewNote, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Note> {
    const id = generateId();
    const now = new Date().toISOString();
    await this.db.insert(schema.notes).values({ ...input, id, createdAt: now, updatedAt: now, version: 1 });
    return (await this.findById(id))!;
  }

  async update(id: string, campaignId: string, input: Partial<Omit<NewNote, 'id' | 'campaignId' | 'createdAt'>>): Promise<Note | undefined> {
    await this.db.update(schema.notes).set({ ...input, updatedAt: new Date().toISOString(), version: sql`${schema.notes.version} + 1` })
      .where(and(eq(schema.notes.id, id), eq(schema.notes.campaignId, campaignId), isNull(schema.notes.deletedAt)));
    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db.update(schema.notes).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(and(eq(schema.notes.id, id), eq(schema.notes.campaignId, campaignId), isNull(schema.notes.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }
}

export class SessionRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  constructor(d1: D1Database) { this.db = drizzle(d1, { schema }); }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { includeDeleted?: boolean } = {},
  ): Promise<{ data: Session[]; total: number }> {
    const conditions = [eq(schema.sessions.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(schema.sessions.deletedAt));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db.select().from(schema.sessions).where(where).limit(pagination.limit).offset(pagination.offset).orderBy(schema.sessions.sessionNumber),
      this.db.select({ count: count() }).from(schema.sessions).where(where),
    ]);
    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<Session | undefined> {
    const conditions = [eq(schema.sessions.id, id), isNull(schema.sessions.deletedAt)];
    if (campaignId) conditions.push(eq(schema.sessions.campaignId, campaignId));
    const result = await this.db.select().from(schema.sessions).where(and(...conditions)).limit(1);
    return result[0];
  }

  async create(input: Omit<NewSession, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Session> {
    const id = generateId();
    const now = new Date().toISOString();
    await this.db.insert(schema.sessions).values({ ...input, id, createdAt: now, updatedAt: now, version: 1 });
    return (await this.findById(id))!;
  }

  async update(id: string, campaignId: string, input: Partial<Omit<NewSession, 'id' | 'campaignId' | 'createdAt'>>): Promise<Session | undefined> {
    await this.db.update(schema.sessions).set({ ...input, updatedAt: new Date().toISOString(), version: sql`${schema.sessions.version} + 1` })
      .where(and(eq(schema.sessions.id, id), eq(schema.sessions.campaignId, campaignId), isNull(schema.sessions.deletedAt)));
    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db.update(schema.sessions).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
      .where(and(eq(schema.sessions.id, id), eq(schema.sessions.campaignId, campaignId), isNull(schema.sessions.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }
}
