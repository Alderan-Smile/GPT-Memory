import { EventRepository, TimelineRepository, RelationshipRepository } from '../repositories/events.js';
import { SearchRepository } from '../repositories/search.js';
import type { CreateEventInput, UpdateEventInput, CreateTimelineInput, UpdateTimelineInput } from '../validators/event.js';
import type { CreateRelationshipInput, UpdateRelationshipInput } from '../validators/relationship.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';
import { NotFoundError } from '../utils/errors.js';
import type { PaginatedResponse } from '../types/index.js';
import type { Event, Timeline, Relationship } from '../database/schema/events.js';

export class EventService {
  private repo: EventRepository;
  private search: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new EventRepository(d1);
    this.search = new SearchRepository(d1);
  }

  async list(campaignId: string, params: { page?: number; limit?: number; q?: string; planet?: string; era?: string; includeDeleted?: boolean }): Promise<PaginatedResponse<Event>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Event> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('Event', id);
    return item;
  }

  async create(input: CreateEventInput): Promise<Event> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'event', item.campaignId, [item.summary, item.era ?? '', item.planet ?? ''].filter(Boolean).join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdateEventInput): Promise<Event> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Event', id);
    await this.search.indexEntity(updated.id, 'event', updated.campaignId, [updated.summary, updated.era ?? ''].filter(Boolean).join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Event', id);
    await this.search.removeFromIndex(id, 'event');
  }
}

export class TimelineService {
  private repo: TimelineRepository;

  constructor(d1: D1Database) {
    this.repo = new TimelineRepository(d1);
  }

  async list(campaignId: string, params: { page?: number; limit?: number; includeDeleted?: boolean }): Promise<PaginatedResponse<Timeline>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Timeline> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('Timeline entry', id);
    return item;
  }

  async create(input: CreateTimelineInput): Promise<Timeline> {
    return this.repo.create(input);
  }

  async update(id: string, campaignId: string, input: UpdateTimelineInput): Promise<Timeline> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Timeline entry', id);
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Timeline entry', id);
  }
}

export class RelationshipService {
  private repo: RelationshipRepository;
  private search: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new RelationshipRepository(d1);
    this.search = new SearchRepository(d1);
  }

  async list(campaignId: string, params: { page?: number; limit?: number; characterId?: string; type?: string; includeDeleted?: boolean }): Promise<PaginatedResponse<Relationship>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Relationship> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('Relationship', id);
    return item;
  }

  async create(input: CreateRelationshipInput): Promise<Relationship> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'relationship', item.campaignId, [item.relationshipType, item.history ?? ''].filter(Boolean).join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdateRelationshipInput): Promise<Relationship> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Relationship', id);
    await this.search.indexEntity(updated.id, 'relationship', updated.campaignId, [updated.relationshipType, updated.history ?? ''].filter(Boolean).join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Relationship', id);
    await this.search.removeFromIndex(id, 'relationship');
  }
}
