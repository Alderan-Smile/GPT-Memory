import { SearchRepository } from '../repositories/search.js';
import type { SearchQuery } from '../validators/search.js';
import type { PaginatedResponse } from '../types/index.js';
import { buildPaginatedResponse, parsePagination } from '../utils/pagination.js';
import type { SearchResult } from '../repositories/search.js';

export class SearchService {
  private repo: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new SearchRepository(d1);
  }

  async search(query: SearchQuery): Promise<PaginatedResponse<SearchResult>> {
    const pagination = parsePagination(query.page, query.limit);
    const { data, total } = await this.repo.search(query);
    return buildPaginatedResponse(data, total, pagination);
  }
}
