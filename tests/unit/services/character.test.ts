import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CharacterService } from '../../../src/services/character.js';
import { CharacterRepository } from '../../../src/repositories/character.js';
import { SearchRepository } from '../../../src/repositories/search.js';
import { NotFoundError } from '../../../src/utils/errors.js';
import type { Character } from '../../../src/database/schema/characters.js';

vi.mock('../../src/repositories/character.js');
vi.mock('../../src/repositories/search.js');

const mockCharacter: Character = {
  id: 'char-1',
  campaignId: 'campaign-1',
  name: 'Kira Voss',
  aliases: ['The Pilot'],
  species: 'Human',
  gender: 'Female',
  birth: null,
  death: null,
  status: 'alive',
  organization: null,
  rank: null,
  currentPlanet: 'planet-1',
  currentLocation: 'loc-1',
  description: 'A skilled pilot',
  emotionalState: 'cautious',
  trust: 75,
  respect: 60,
  friendship: 70,
  fear: 10,
  curiosity: 80,
  anger: 5,
  love: 0,
  hate: 0,
  debt: 0,
  lastInteraction: null,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  deletedAt: null,
  version: 1,
  metadata: null,
};

describe('CharacterService', () => {
  let service: CharacterService;
  let repoMock: {
    findAll: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    findByLocation: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
  };
  let searchMock: {
    indexEntity: ReturnType<typeof vi.fn>;
    removeFromIndex: ReturnType<typeof vi.fn>;
    search: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    repoMock = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByLocation: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    };
    searchMock = {
      indexEntity: vi.fn().mockResolvedValue(undefined),
      removeFromIndex: vi.fn().mockResolvedValue(undefined),
      search: vi.fn(),
    };
    vi.mocked(CharacterRepository).mockImplementation(() => repoMock as unknown as CharacterRepository);
    vi.mocked(SearchRepository).mockImplementation(() => searchMock as unknown as SearchRepository);
    service = new CharacterService({} as D1Database);
  });

  describe('list', () => {
    it('returns paginated characters', async () => {
      repoMock.findAll.mockResolvedValue({ data: [mockCharacter], total: 1 });

      const result = await service.list('campaign-1', { page: 1, limit: 20 });
      expect(result.success).toBe(true);
      expect(result.data[0]?.name).toBe('Kira Voss');
      expect(result.meta.total).toBe(1);
    });
  });

  describe('getById', () => {
    it('returns character when found', async () => {
      repoMock.findById.mockResolvedValue(mockCharacter);
      const result = await service.getById('char-1', 'campaign-1');
      expect(result).toEqual(mockCharacter);
    });

    it('throws NotFoundError when not found', async () => {
      repoMock.findById.mockResolvedValue(undefined);
      await expect(service.getById('bad-id', 'campaign-1')).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('creates character and indexes it', async () => {
      repoMock.create.mockResolvedValue(mockCharacter);

      const result = await service.create({
        campaignId: 'campaign-1',
        name: 'Kira Voss',
      });

      expect(result).toEqual(mockCharacter);
      expect(searchMock.indexEntity).toHaveBeenCalledWith(
        'char-1',
        'character',
        'campaign-1',
        expect.stringContaining('Kira Voss'),
      );
    });
  });

  describe('delete', () => {
    it('soft deletes and removes from search index', async () => {
      repoMock.softDelete.mockResolvedValue(true);

      await service.delete('char-1', 'campaign-1');

      expect(repoMock.softDelete).toHaveBeenCalledWith('char-1', 'campaign-1');
      expect(searchMock.removeFromIndex).toHaveBeenCalledWith('char-1', 'character');
    });

    it('throws NotFoundError if character not found', async () => {
      repoMock.softDelete.mockResolvedValue(false);
      await expect(service.delete('bad', 'campaign-1')).rejects.toThrow(NotFoundError);
    });
  });
});
