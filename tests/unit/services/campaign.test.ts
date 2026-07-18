import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CampaignService } from '../../../src/services/campaign.js';
import { CampaignRepository } from '../../../src/repositories/campaign.js';
import { NotFoundError } from '../../../src/utils/errors.js';
import type { Campaign } from '../../../src/database/schema/campaigns.js';

vi.mock('../../src/repositories/campaign.js');

const mockCampaign: Campaign = {
  id: 'test-id-1',
  name: 'Test Campaign',
  description: 'A test campaign',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  deletedAt: null,
  version: 1,
  metadata: null,
};

describe('CampaignService', () => {
  let service: CampaignService;
  let repoMock: {
    findAll: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    softDelete: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    repoMock = {
      findAll: vi.fn(),
      findById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      softDelete: vi.fn(),
    };
    vi.mocked(CampaignRepository).mockImplementation(() => repoMock as unknown as CampaignRepository);
    service = new CampaignService({} as D1Database);
  });

  describe('list', () => {
    it('returns paginated campaigns', async () => {
      repoMock.findAll.mockResolvedValue({ data: [mockCampaign], total: 1 });

      const result = await service.list({ page: 1, limit: 20 });

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
    });

    it('passes search query to repository', async () => {
      repoMock.findAll.mockResolvedValue({ data: [], total: 0 });

      await service.list({ q: 'star wars' });

      expect(repoMock.findAll).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({ q: 'star wars' }),
      );
    });
  });

  describe('getById', () => {
    it('returns a campaign when found', async () => {
      repoMock.findById.mockResolvedValue(mockCampaign);

      const result = await service.getById('test-id-1');
      expect(result).toEqual(mockCampaign);
    });

    it('throws NotFoundError when campaign does not exist', async () => {
      repoMock.findById.mockResolvedValue(undefined);

      await expect(service.getById('non-existent')).rejects.toThrow(NotFoundError);
    });
  });

  describe('create', () => {
    it('creates and returns a campaign', async () => {
      repoMock.create.mockResolvedValue(mockCampaign);

      const result = await service.create({ name: 'Test Campaign' });
      expect(result).toEqual(mockCampaign);
      expect(repoMock.create).toHaveBeenCalledWith({ name: 'Test Campaign' });
    });
  });

  describe('update', () => {
    it('updates and returns the campaign', async () => {
      const updated = { ...mockCampaign, name: 'Updated Campaign' };
      repoMock.findById.mockResolvedValue(mockCampaign);
      repoMock.update.mockResolvedValue(updated);

      const result = await service.update('test-id-1', { name: 'Updated Campaign' });
      expect(result.name).toBe('Updated Campaign');
    });

    it('throws NotFoundError if campaign not found', async () => {
      repoMock.findById.mockResolvedValue(undefined);

      await expect(service.update('bad-id', { name: 'X' })).rejects.toThrow(NotFoundError);
    });
  });

  describe('delete', () => {
    it('soft deletes a campaign', async () => {
      repoMock.softDelete.mockResolvedValue(true);

      await expect(service.delete('test-id-1')).resolves.not.toThrow();
    });

    it('throws NotFoundError if campaign does not exist', async () => {
      repoMock.softDelete.mockResolvedValue(false);

      await expect(service.delete('bad-id')).rejects.toThrow(NotFoundError);
    });
  });
});
