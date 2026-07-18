import { QuoteRepository, NoteRepository, SessionRepository } from '../repositories/misc.js';
import { SearchRepository } from '../repositories/search.js';
import type { CreateQuoteInput, UpdateQuoteInput, CreateNoteInput, UpdateNoteInput, CreateSessionInput, UpdateSessionInput } from '../validators/misc.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';
import { NotFoundError } from '../utils/errors.js';
import type { PaginatedResponse } from '../types/index.js';
import type { Quote, Note, Session } from '../database/schema/misc.js';

export class QuoteService {
  private repo: QuoteRepository;
  private search: SearchRepository;
  constructor(d1: D1Database) { this.repo = new QuoteRepository(d1); this.search = new SearchRepository(d1); }

  async list(campaignId: string, params: { page?: number; limit?: number; author?: string; q?: string; includeDeleted?: boolean }): Promise<PaginatedResponse<Quote>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Quote> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('Quote', id);
    return item;
  }

  async create(input: CreateQuoteInput): Promise<Quote> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'quote', item.campaignId, [item.text, item.author ?? '', item.context ?? ''].filter(Boolean).join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdateQuoteInput): Promise<Quote> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Quote', id);
    await this.search.indexEntity(updated.id, 'quote', updated.campaignId, [updated.text, updated.author ?? ''].filter(Boolean).join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Quote', id);
    await this.search.removeFromIndex(id, 'quote');
  }
}

export class NoteService {
  private repo: NoteRepository;
  private search: SearchRepository;
  constructor(d1: D1Database) { this.repo = new NoteRepository(d1); this.search = new SearchRepository(d1); }

  async list(campaignId: string, params: { page?: number; limit?: number; entityId?: string; entityType?: string; pinned?: boolean; q?: string; includeDeleted?: boolean }): Promise<PaginatedResponse<Note>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Note> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('Note', id);
    return item;
  }

  async create(input: CreateNoteInput): Promise<Note> {
    const item = await this.repo.create(input);
    await this.search.indexEntity(item.id, 'note', item.campaignId, [item.title ?? '', item.content].filter(Boolean).join(' '));
    return item;
  }

  async update(id: string, campaignId: string, input: UpdateNoteInput): Promise<Note> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Note', id);
    await this.search.indexEntity(updated.id, 'note', updated.campaignId, [updated.title ?? '', updated.content].filter(Boolean).join(' '));
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Note', id);
    await this.search.removeFromIndex(id, 'note');
  }
}

export class SessionService {
  private repo: SessionRepository;
  constructor(d1: D1Database) { this.repo = new SessionRepository(d1); }

  async list(campaignId: string, params: { page?: number; limit?: number; includeDeleted?: boolean }): Promise<PaginatedResponse<Session>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Session> {
    const item = await this.repo.findById(id, campaignId);
    if (!item) throw new NotFoundError('Session', id);
    return item;
  }

  async create(input: CreateSessionInput): Promise<Session> {
    return this.repo.create(input);
  }

  async update(id: string, campaignId: string, input: UpdateSessionInput): Promise<Session> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Session', id);
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Session', id);
  }
}
