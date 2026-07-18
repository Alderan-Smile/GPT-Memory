import {
  OrganizationRepository,
  ShipRepository,
  VehicleRepository,
  ObjectRepository,
} from '../repositories/entities.js';
import { SearchRepository } from '../repositories/search.js';
import type { CreateOrganizationInput, UpdateOrganizationInput } from '../validators/organization.js';
import type { CreateShipInput, UpdateShipInput, CreateVehicleInput, UpdateVehicleInput } from '../validators/ship.js';
import type { CreateObjectInput, UpdateObjectInput } from '../validators/object.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';
import { NotFoundError } from '../utils/errors.js';
import type { PaginatedResponse } from '../types/index.js';
import type { Organization } from '../database/schema/organizations.js';
import type { Ship, Vehicle } from '../database/schema/ships.js';
import type { DBObject } from '../database/schema/objects.js';

function makeService<TSelect extends { id: string; campaignId: string; name: string; description?: string | null }, TCreate, TUpdate>(
  RepoClass: new (d1: D1Database) => {
    findAll(c: string, p: ReturnType<typeof parsePagination>, f?: { q?: string; includeDeleted?: boolean }): Promise<{ data: TSelect[]; total: number }>;
    findById(id: string, c?: string): Promise<TSelect | undefined>;
    create(i: TCreate): Promise<TSelect>;
    update(id: string, c: string, i: TUpdate): Promise<TSelect | undefined>;
    softDelete(id: string, c: string): Promise<boolean>;
  },
  entityType: string,
) {
  return class {
    private repo: InstanceType<typeof RepoClass>;
    private search: SearchRepository;

    constructor(d1: D1Database) {
      this.repo = new RepoClass(d1);
      this.search = new SearchRepository(d1);
    }

    async list(campaignId: string, params: { page?: number; limit?: number; q?: string; includeDeleted?: boolean }): Promise<PaginatedResponse<TSelect>> {
      const pagination = parsePagination(params.page, params.limit);
      const { data, total } = await this.repo.findAll(campaignId, pagination, params);
      return buildPaginatedResponse(data, total, pagination);
    }

    async getById(id: string, campaignId: string): Promise<TSelect> {
      const item = await this.repo.findById(id, campaignId);
      if (!item) throw new NotFoundError(entityType, id);
      return item;
    }

    async create(input: TCreate): Promise<TSelect> {
      const item = await this.repo.create(input);
      await this.search.indexEntity(item.id, entityType, item.campaignId, [item.name, item.description ?? ''].filter(Boolean).join(' '));
      return item;
    }

    async update(id: string, campaignId: string, input: TUpdate): Promise<TSelect> {
      await this.getById(id, campaignId);
      const updated = await this.repo.update(id, campaignId, input);
      if (!updated) throw new NotFoundError(entityType, id);
      await this.search.indexEntity(updated.id, entityType, updated.campaignId, [updated.name, updated.description ?? ''].filter(Boolean).join(' '));
      return updated;
    }

    async delete(id: string, campaignId: string): Promise<void> {
      const deleted = await this.repo.softDelete(id, campaignId);
      if (!deleted) throw new NotFoundError(entityType, id);
      await this.search.removeFromIndex(id, entityType);
    }
  };
}

export const OrganizationService = makeService<
  Organization,
  Omit<Organization, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'deletedAt'>,
  Partial<Omit<Organization, 'id' | 'campaignId' | 'createdAt'>>
>(OrganizationRepository, 'organization');

export const ShipService = makeService<
  Ship,
  Omit<Ship, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'deletedAt'>,
  Partial<Omit<Ship, 'id' | 'campaignId' | 'createdAt'>>
>(ShipRepository, 'ship');

export const VehicleService = makeService<
  Vehicle,
  Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'deletedAt'>,
  Partial<Omit<Vehicle, 'id' | 'campaignId' | 'createdAt'>>
>(VehicleRepository, 'vehicle');

export const ObjectService = makeService<
  DBObject,
  Omit<DBObject, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'deletedAt'>,
  Partial<Omit<DBObject, 'id' | 'campaignId' | 'createdAt'>>
>(ObjectRepository, 'object');
