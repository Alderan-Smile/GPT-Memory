import { eq, isNull, and, like, sql, count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema/index.js';
import type { Organization, NewOrganization } from '../database/schema/organizations.js';
import type { Ship, NewShip, Vehicle, NewVehicle } from '../database/schema/ships.js';
import type { DBObject, NewDBObject } from '../database/schema/objects.js';
import { generateId } from '../utils/id.js';
import type { PaginationParams } from '../types/index.js';

function buildRepo(d1: D1Database, table: typeof schema.organizations | typeof schema.ships | typeof schema.vehicles | typeof schema.objects) {
  const db = drizzle(d1, { schema });

  async function findAll<T>(
    campaignId: string,
    pagination: PaginationParams,
    filters: { q?: string; includeDeleted?: boolean } = {},
  ): Promise<{ data: T[]; total: number }> {
    const conditions = [eq(table.campaignId, campaignId)];
    if (!filters.includeDeleted) conditions.push(isNull(table.deletedAt));
    if (filters.q) conditions.push(like(table.name, `%${filters.q}%`));
    const where = and(...conditions);

    const [data, totalResult] = await Promise.all([
      db.select().from(table as typeof schema.organizations).where(where).limit(pagination.limit).offset(pagination.offset).orderBy(table.name) as Promise<T[]>,
      db.select({ count: count() }).from(table as typeof schema.organizations).where(where),
    ]);

    return { data, total: totalResult[0]?.count ?? 0 };
  }

  async function findById<T>(id: string, campaignId?: string): Promise<T | undefined> {
    const conditions = [eq(table.id, id), isNull(table.deletedAt)];
    if (campaignId) conditions.push(eq(table.campaignId, campaignId));
    const result = await db.select().from(table as typeof schema.organizations).where(and(...conditions)).limit(1) as T[];
    return result[0];
  }

  async function create<TInsert, TSelect>(
    input: Omit<TInsert, 'id' | 'createdAt' | 'updatedAt' | 'version'>,
  ): Promise<TSelect> {
    const id = generateId();
    const now = new Date().toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.insert(table as typeof schema.organizations) as any).values({ ...(input as object), id, createdAt: now, updatedAt: now, version: 1 });
    return (await findById<TSelect>(id))!;
  }

  async function update<TInsert, TSelect>(
    id: string, campaignId: string,
    input: Partial<Omit<TInsert, 'id' | 'campaignId' | 'createdAt'>>,
  ): Promise<TSelect | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (db.update(table as typeof schema.organizations) as any).set({ ...(input as object), updatedAt: new Date().toISOString(), version: sql`${table.version} + 1` }).where(and(eq(table.id, id), eq(table.campaignId, campaignId), isNull(table.deletedAt)));
    return findById<TSelect>(id, campaignId);
  }

  async function softDelete(id: string, campaignId: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (db.update(table as typeof schema.organizations) as any).set({ deletedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).where(and(eq(table.id, id), eq(table.campaignId, campaignId), isNull(table.deletedAt)));
    return (result.meta?.changes ?? 0) > 0;
  }

  return { findAll, findById, create, update, softDelete };
}

export class OrganizationRepository {
  private r: ReturnType<typeof buildRepo>;
  constructor(d1: D1Database) { this.r = buildRepo(d1, schema.organizations); }
  findAll = (c: string, p: PaginationParams, f?: { q?: string; includeDeleted?: boolean }) => this.r.findAll<Organization>(c, p, f);
  findById = (id: string, c?: string) => this.r.findById<Organization>(id, c);
  create = (i: Omit<NewOrganization, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => this.r.create<NewOrganization, Organization>(i);
  update = (id: string, c: string, i: Partial<Omit<NewOrganization, 'id' | 'campaignId' | 'createdAt'>>) => this.r.update<NewOrganization, Organization>(id, c, i);
  softDelete = (id: string, c: string) => this.r.softDelete(id, c);
}

export class ShipRepository {
  private r: ReturnType<typeof buildRepo>;
  constructor(d1: D1Database) { this.r = buildRepo(d1, schema.ships); }
  findAll = (c: string, p: PaginationParams, f?: { q?: string; includeDeleted?: boolean }) => this.r.findAll<Ship>(c, p, f);
  findById = (id: string, c?: string) => this.r.findById<Ship>(id, c);
  create = (i: Omit<NewShip, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => this.r.create<NewShip, Ship>(i);
  update = (id: string, c: string, i: Partial<Omit<NewShip, 'id' | 'campaignId' | 'createdAt'>>) => this.r.update<NewShip, Ship>(id, c, i);
  softDelete = (id: string, c: string) => this.r.softDelete(id, c);
}

export class VehicleRepository {
  private r: ReturnType<typeof buildRepo>;
  constructor(d1: D1Database) { this.r = buildRepo(d1, schema.vehicles); }
  findAll = (c: string, p: PaginationParams, f?: { q?: string; includeDeleted?: boolean }) => this.r.findAll<Vehicle>(c, p, f);
  findById = (id: string, c?: string) => this.r.findById<Vehicle>(id, c);
  create = (i: Omit<NewVehicle, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => this.r.create<NewVehicle, Vehicle>(i);
  update = (id: string, c: string, i: Partial<Omit<NewVehicle, 'id' | 'campaignId' | 'createdAt'>>) => this.r.update<NewVehicle, Vehicle>(id, c, i);
  softDelete = (id: string, c: string) => this.r.softDelete(id, c);
}

export class ObjectRepository {
  private r: ReturnType<typeof buildRepo>;
  constructor(d1: D1Database) { this.r = buildRepo(d1, schema.objects); }
  findAll = (c: string, p: PaginationParams, f?: { q?: string; includeDeleted?: boolean }) => this.r.findAll<DBObject>(c, p, f);
  findById = (id: string, c?: string) => this.r.findById<DBObject>(id, c);
  create = (i: Omit<NewDBObject, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => this.r.create<NewDBObject, DBObject>(i);
  update = (id: string, c: string, i: Partial<Omit<NewDBObject, 'id' | 'campaignId' | 'createdAt'>>) => this.r.update<NewDBObject, DBObject>(id, c, i);
  softDelete = (id: string, c: string) => this.r.softDelete(id, c);
}
