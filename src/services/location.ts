import { LocationRepository, PlanetRepository, StarSystemRepository } from '../repositories/location.js';
import { SearchRepository } from '../repositories/search.js';
import type {
  CreateLocationInput, UpdateLocationInput,
  CreatePlanetInput, UpdatePlanetInput,
  CreateStarSystemInput, UpdateStarSystemInput,
} from '../validators/location.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';
import { NotFoundError } from '../utils/errors.js';
import type { PaginatedResponse } from '../types/index.js';
import type { Location, Planet, StarSystem } from '../database/schema/locations.js';

export class LocationService {
  private repo: LocationRepository;
  private search: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new LocationRepository(d1);
    this.search = new SearchRepository(d1);
  }

  async list(campaignId: string, params: { page?: number; limit?: number; q?: string; includeDeleted?: boolean }): Promise<PaginatedResponse<Location>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Location> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('Location', id);
    return item;
  }

  async create(input: CreateLocationInput): Promise<Location> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'location', item.campaignId, [item.name, item.description ?? ''].join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdateLocationInput): Promise<Location> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Location', id);
    await this.search.indexEntity(updated.id, 'location', updated.campaignId, [updated.name, updated.description ?? ''].join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Location', id);
    await this.search.removeFromIndex(id, 'location');
  }
}

export class PlanetService {
  private repo: PlanetRepository;
  private search: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new PlanetRepository(d1);
    this.search = new SearchRepository(d1);
  }

  async list(campaignId: string, params: { page?: number; limit?: number; q?: string; includeDeleted?: boolean }): Promise<PaginatedResponse<Planet>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Planet> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('Planet', id);
    return item;
  }

  async create(input: CreatePlanetInput): Promise<Planet> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'planet', item.campaignId, [item.name, item.description ?? ''].join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdatePlanetInput): Promise<Planet> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Planet', id);
    await this.search.indexEntity(updated.id, 'planet', updated.campaignId, [updated.name, updated.description ?? ''].join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Planet', id);
    await this.search.removeFromIndex(id, 'planet');
  }
}

export class StarSystemService {
  private repo: StarSystemRepository;
  private search: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new StarSystemRepository(d1);
    this.search = new SearchRepository(d1);
  }

  async list(campaignId: string, params: { page?: number; limit?: number; q?: string; includeDeleted?: boolean }): Promise<PaginatedResponse<StarSystem>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<StarSystem> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('StarSystem', id);
    return item;
  }

  async create(input: CreateStarSystemInput): Promise<StarSystem> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'star_system', item.campaignId, [item.name, item.description ?? ''].join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdateStarSystemInput): Promise<StarSystem> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('StarSystem', id);
    await this.search.indexEntity(updated.id, 'star_system', updated.campaignId, [updated.name, updated.description ?? ''].join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('StarSystem', id);
    await this.search.removeFromIndex(id, 'star_system');
  }
}
