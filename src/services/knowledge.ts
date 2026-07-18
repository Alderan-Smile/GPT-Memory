import { SecretRepository, PlayerKnowledgeRepository, WorldKnowledgeRepository } from '../repositories/knowledge.js';
import { SearchRepository } from '../repositories/search.js';
import type { CreateSecretInput, UpdateSecretInput } from '../validators/relationship.js';
import type {
  CreatePlayerKnowledgeInput, UpdatePlayerKnowledgeInput,
  CreateWorldKnowledgeInput, UpdateWorldKnowledgeInput,
} from '../validators/knowledge.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';
import { NotFoundError } from '../utils/errors.js';
import type { PaginatedResponse } from '../types/index.js';
import type { Secret, PlayerKnowledge, WorldKnowledge } from '../database/schema/knowledge.js';

export class SecretService {
  private repo: SecretRepository;
  private search: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new SecretRepository(d1);
    this.search = new SearchRepository(d1);
  }

  async list(campaignId: string, params: { page?: number; limit?: number; revealed?: boolean; visibleToPlayer?: boolean; includeDeleted?: boolean }): Promise<PaginatedResponse<Secret>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Secret> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('Secret', id);
    return item;
  }

  async create(input: CreateSecretInput): Promise<Secret> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'secret', item.campaignId, [item.title, item.content].join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdateSecretInput): Promise<Secret> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Secret', id);
    await this.search.indexEntity(updated.id, 'secret', updated.campaignId, [updated.title, updated.content].join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Secret', id);
    await this.search.removeFromIndex(id, 'secret');
  }
}

export class PlayerKnowledgeService {
  private repo: PlayerKnowledgeRepository;
  private search: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new PlayerKnowledgeRepository(d1);
    this.search = new SearchRepository(d1);
  }

  async list(campaignId: string, params: { page?: number; limit?: number; characterId?: string; category?: string; q?: string; includeDeleted?: boolean }): Promise<PaginatedResponse<PlayerKnowledge>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<PlayerKnowledge> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('PlayerKnowledge', id);
    return item;
  }

  async create(input: CreatePlayerKnowledgeInput): Promise<PlayerKnowledge> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'player_knowledge', item.campaignId, [item.subject, item.content].join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdatePlayerKnowledgeInput): Promise<PlayerKnowledge> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('PlayerKnowledge', id);
    await this.search.indexEntity(updated.id, 'player_knowledge', updated.campaignId, [updated.subject, updated.content].join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('PlayerKnowledge', id);
    await this.search.removeFromIndex(id, 'player_knowledge');
  }
}

export class WorldKnowledgeService {
  private repo: WorldKnowledgeRepository;
  private search: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new WorldKnowledgeRepository(d1);
    this.search = new SearchRepository(d1);
  }

  async list(campaignId: string, params: { page?: number; limit?: number; category?: string; q?: string; canon?: boolean; includeDeleted?: boolean }): Promise<PaginatedResponse<WorldKnowledge>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<WorldKnowledge> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('WorldKnowledge', id);
    return item;
  }

  async create(input: CreateWorldKnowledgeInput): Promise<WorldKnowledge> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'world_knowledge', item.campaignId, [item.subject, item.content].join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdateWorldKnowledgeInput): Promise<WorldKnowledge> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('WorldKnowledge', id);
    await this.search.indexEntity(updated.id, 'world_knowledge', updated.campaignId, [updated.subject, updated.content].join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('WorldKnowledge', id);
    await this.search.removeFromIndex(id, 'world_knowledge');
  }
}
