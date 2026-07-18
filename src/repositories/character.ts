import { eq, isNull, and, like, sql, count, or } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema/index.js';
import type { Character, NewCharacter } from '../database/schema/characters.js';
import { generateId } from '../utils/id.js';
import type { PaginationParams } from '../types/index.js';

export class CharacterRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;

  constructor(d1: D1Database) {
    this.db = drizzle(d1, { schema });
  }

  async findAll(
    campaignId: string,
    pagination: PaginationParams,
    filters: { q?: string; status?: string; includeDeleted?: boolean } = {},
  ): Promise<{ data: Character[]; total: number }> {
    const conditions = [eq(schema.characters.campaignId, campaignId)];

    if (!filters.includeDeleted) {
      conditions.push(isNull(schema.characters.deletedAt));
    }
    if (filters.status) {
      conditions.push(
        eq(
          schema.characters.status,
          filters.status as 'alive' | 'dead' | 'unknown' | 'missing',
        ),
      );
    }
    if (filters.q) {
      conditions.push(like(schema.characters.name, `%${filters.q}%`));
    }

    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      this.db
        .select()
        .from(schema.characters)
        .where(where)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .orderBy(schema.characters.name),
      this.db.select({ count: count() }).from(schema.characters).where(where),
    ]);

    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async findById(id: string, campaignId?: string): Promise<Character | undefined> {
    const conditions = [
      eq(schema.characters.id, id),
      isNull(schema.characters.deletedAt),
    ];
    if (campaignId) conditions.push(eq(schema.characters.campaignId, campaignId));

    const result = await this.db
      .select()
      .from(schema.characters)
      .where(and(...conditions))
      .limit(1);

    return result[0];
  }

  async findByLocation(
    campaignId: string,
    locationId?: string,
    planetId?: string,
  ): Promise<Character[]> {
    const conditions = [
      eq(schema.characters.campaignId, campaignId),
      isNull(schema.characters.deletedAt),
    ];

    if (locationId) conditions.push(eq(schema.characters.currentLocation, locationId));
    if (planetId) conditions.push(eq(schema.characters.currentPlanet, planetId));

    return this.db
      .select()
      .from(schema.characters)
      .where(and(...conditions));
  }

  async create(input: Omit<NewCharacter, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<Character> {
    const id = generateId();
    const now = new Date().toISOString();

    await this.db.insert(schema.characters).values({
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
      version: 1,
    });

    return (await this.findById(id))!;
  }

  async update(
    id: string,
    campaignId: string,
    input: Partial<Omit<NewCharacter, 'id' | 'campaignId' | 'createdAt'>>,
  ): Promise<Character | undefined> {
    await this.db
      .update(schema.characters)
      .set({
        ...input,
        updatedAt: new Date().toISOString(),
        version: sql`${schema.characters.version} + 1`,
      })
      .where(
        and(
          eq(schema.characters.id, id),
          eq(schema.characters.campaignId, campaignId),
          isNull(schema.characters.deletedAt),
        ),
      );

    return this.findById(id, campaignId);
  }

  async softDelete(id: string, campaignId: string): Promise<boolean> {
    const result = await this.db
      .update(schema.characters)
      .set({
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(schema.characters.id, id),
          eq(schema.characters.campaignId, campaignId),
          isNull(schema.characters.deletedAt),
        ),
      );

    return (result.meta?.changes ?? 0) > 0;
  }
}
