import { eq, isNull, and, like, sql, count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema/index.js';
import type {
  Location, NewLocation,
  Planet, NewPlanet,
  StarSystem, NewStarSystem,
} from '../database/schema/locations.js';
import { generateId } from '../utils/id.js';
import type { PaginationParams } from '../types/index.js';

function makeRepo<TSelect, TInsert>(
  db: ReturnType<typeof drizzle<typeof schema>>,
  table: typeof schema.locations | typeof schema.planets | typeof schema.starSystems,
) {
  return {
    async findAll(
      campaignId: string,
      pagination: PaginationParams,
      filters: { q?: string; includeDeleted?: boolean } = {},
    ): Promise<{ data: TSelect[]; total: number }> {
      const conditions = [eq(table.campaignId, campaignId)];
      if (!filters.includeDeleted) conditions.push(isNull(table.deletedAt));
      if (filters.q) conditions.push(like(table.name, `%${filters.q}%`));
      const where = and(...conditions);

      const [data, totalResult] = await Promise.all([
        db.select().from(table as typeof schema.locations).where(where).limit(pagination.limit).offset(pagination.offset).orderBy(table.name) as Promise<TSelect[]>,
        db.select({ count: count() }).from(table as typeof schema.locations).where(where),
      ]);

      return { data, total: totalResult[0]?.count ?? 0 };
    },

    async findById(id: string, campaignId?: string): Promise<TSelect | undefined> {
      const conditions = [eq(table.id, id), isNull(table.deletedAt)];
      if (campaignId) conditions.push(eq(table.campaignId, campaignId));

      const result = await db.select().from(table as typeof schema.locations).where(and(...conditions)).limit(1) as TSelect[];
      return result[0];
    },

    async create(input: Omit<TInsert, 'id' | 'createdAt' | 'updatedAt' | 'version'>): Promise<TSelect> {
      const id = generateId();
      const now = new Date().toISOString();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db.insert(table as typeof schema.locations) as any).values({
        ...(input as object),
        id,
        createdAt: now,
        updatedAt: now,
        version: 1,
      });

      return (await this.findById(id))!;
    },

    async update(id: string, campaignId: string, input: Partial<Omit<TInsert, 'id' | 'campaignId' | 'createdAt'>>): Promise<TSelect | undefined> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (db.update(table as typeof schema.locations) as any).set({
        ...(input as object),
        updatedAt: new Date().toISOString(),
        version: sql`${table.version} + 1`,
      }).where(and(eq(table.id, id), eq(table.campaignId, campaignId), isNull(table.deletedAt)));

      return this.findById(id, campaignId);
    },

    async softDelete(id: string, campaignId: string): Promise<boolean> {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await (db.update(table as typeof schema.locations) as any).set({
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }).where(and(eq(table.id, id), eq(table.campaignId, campaignId), isNull(table.deletedAt)));

      return (result.meta?.changes ?? 0) > 0;
    },
  };
}

export class LocationRepository {
  private repo: ReturnType<typeof makeRepo<Location, NewLocation>>;
  constructor(d1: D1Database) {
    const db = drizzle(d1, { schema });
    this.repo = makeRepo<Location, NewLocation>(db, schema.locations);
  }
  findAll = (campaignId: string, pagination: PaginationParams, filters?: { q?: string; includeDeleted?: boolean }) => this.repo.findAll(campaignId, pagination, filters);
  findById = (id: string, campaignId?: string) => this.repo.findById(id, campaignId);
  create = (input: Omit<NewLocation, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => this.repo.create(input);
  update = (id: string, campaignId: string, input: Partial<Omit<NewLocation, 'id' | 'campaignId' | 'createdAt'>>) => this.repo.update(id, campaignId, input);
  softDelete = (id: string, campaignId: string) => this.repo.softDelete(id, campaignId);
}

export class PlanetRepository {
  private repo: ReturnType<typeof makeRepo<Planet, NewPlanet>>;
  constructor(d1: D1Database) {
    const db = drizzle(d1, { schema });
    this.repo = makeRepo<Planet, NewPlanet>(db, schema.planets);
  }
  findAll = (campaignId: string, pagination: PaginationParams, filters?: { q?: string; includeDeleted?: boolean }) => this.repo.findAll(campaignId, pagination, filters);
  findById = (id: string, campaignId?: string) => this.repo.findById(id, campaignId);
  create = (input: Omit<NewPlanet, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => this.repo.create(input);
  update = (id: string, campaignId: string, input: Partial<Omit<NewPlanet, 'id' | 'campaignId' | 'createdAt'>>) => this.repo.update(id, campaignId, input);
  softDelete = (id: string, campaignId: string) => this.repo.softDelete(id, campaignId);
}

export class StarSystemRepository {
  private repo: ReturnType<typeof makeRepo<StarSystem, NewStarSystem>>;
  constructor(d1: D1Database) {
    const db = drizzle(d1, { schema });
    this.repo = makeRepo<StarSystem, NewStarSystem>(db, schema.starSystems);
  }
  findAll = (campaignId: string, pagination: PaginationParams, filters?: { q?: string; includeDeleted?: boolean }) => this.repo.findAll(campaignId, pagination, filters);
  findById = (id: string, campaignId?: string) => this.repo.findById(id, campaignId);
  create = (input: Omit<NewStarSystem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => this.repo.create(input);
  update = (id: string, campaignId: string, input: Partial<Omit<NewStarSystem, 'id' | 'campaignId' | 'createdAt'>>) => this.repo.update(id, campaignId, input);
  softDelete = (id: string, campaignId: string) => this.repo.softDelete(id, campaignId);
}
