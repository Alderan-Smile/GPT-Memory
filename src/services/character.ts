import { CharacterRepository } from '../repositories/character.js';
import { SearchRepository } from '../repositories/search.js';
import type { CreateCharacterInput, UpdateCharacterInput } from '../validators/character.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';
import { NotFoundError } from '../utils/errors.js';
import type { PaginatedResponse } from '../types/index.js';
import type { Character } from '../database/schema/characters.js';

export class CharacterService {
  private repo: CharacterRepository;
  private search: SearchRepository;

  constructor(d1: D1Database) {
    this.repo = new CharacterRepository(d1);
    this.search = new SearchRepository(d1);
  }

  async list(
    campaignId: string,
    params: { page?: number; limit?: number; q?: string | undefined; status?: string | undefined; includeDeleted?: boolean },
  ): Promise<PaginatedResponse<Character>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(campaignId, pagination, params);
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string, campaignId: string): Promise<Character> {
    const char = await this.repo.findById(id, campaignId);
    if (!char) throw new NotFoundError('Character', id);
    return char;
  }

  async create(input: CreateCharacterInput): Promise<Character> {
    const char = await this.repo.create(input);
    await this.indexCharacter(char);
    return char;
  }

  async update(id: string, campaignId: string, input: UpdateCharacterInput): Promise<Character> {
    await this.getById(id, campaignId);
    const updated = await this.repo.update(id, campaignId, input);
    if (!updated) throw new NotFoundError('Character', id);
    await this.indexCharacter(updated);
    return updated;
  }

  async delete(id: string, campaignId: string): Promise<void> {
    const deleted = await this.repo.softDelete(id, campaignId);
    if (!deleted) throw new NotFoundError('Character', id);
    await this.search.removeFromIndex(id, 'character');
  }

  private async indexCharacter(char: Character): Promise<void> {
    const content = [
      char.name,
      char.aliases ? (char.aliases as string[]).join(' ') : '',
      char.species ?? '',
      char.description ?? '',
      char.organization ?? '',
      char.rank ?? '',
      char.emotionalState ?? '',
    ]
      .filter(Boolean)
      .join(' ');

    await this.search.indexEntity(char.id, 'character', char.campaignId, content);
  }
}
