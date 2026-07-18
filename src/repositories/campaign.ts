import { eq, isNull, and, like, sql, count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema/index.js';
import type { Campaign, NewCampaign } from '../database/schema/campaigns.js';
import { generateId } from '../utils/id.js';
import type { PaginationParams } from '../types/index.js';

export class CampaignRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;

  constructor(d1: D1Database) {
    this.db = drizzle(d1, { schema });
  }

  async findAll(
    pagination: PaginationParams,
    filters: { q?: string; includeDeleted?: boolean } = {},
  ): Promise<{ data: Campaign[]; total: number }> {
    const conditions = [];

    if (!filters.includeDeleted) {
      conditions.push(isNull(schema.campaigns.deletedAt));
    }

    if (filters.q) {
      conditions.push(like(schema.campaigns.name, `%${filters.q}%`));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalResult] = await Promise.all([
      this.db
        .select()
        .from(schema.campaigns)
        .where(where)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .orderBy(schema.campaigns.createdAt),
      this.db
        .select({ count: count() })
        .from(schema.campaigns)
        .where(where),
    ]);

    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string): Promise<Campaign | undefined> {
    const result = await this.db
      .select()
      .from(schema.campaigns)
      .where(and(eq(schema.campaigns.id, id), isNull(schema.campaigns.deletedAt)))
      .limit(1);

    return result[0];
  }

  async create(input: Omit<NewCampaign, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Campaign> {
    const id = generateId();
    const now = new Date().toISOString();

    await this.db.insert(schema.campaigns).values({
      id,
      ...input,
      createdAt: now,
      updatedAt: now,
      version: 1,
    });

    return (await this.findById(id))!;
  }

  async update(id: string, input: Partial<Omit<NewCampaign, 'id' | 'createdAt'>>): Promise<Campaign | undefined> {
    await this.db
      .update(schema.campaigns)
      .set({
        ...input,
        updatedAt: new Date().toISOString(),
        version: sql`${schema.campaigns.version} + 1`,
      })
      .where(and(eq(schema.campaigns.id, id), isNull(schema.campaigns.deletedAt)));

    return this.findById(id);
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.db
      .update(schema.campaigns)
      .set({
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(and(eq(schema.campaigns.id, id), isNull(schema.campaigns.deletedAt)));

    return (result.meta?.changes ?? 0) > 0;
  }
}
