import { CampaignRepository } from '../repositories/campaign.js';
import type { CreateCampaignInput, UpdateCampaignInput } from '../validators/campaign.js';
import { parsePagination, buildPaginatedResponse } from '../utils/pagination.js';
import { NotFoundError } from '../utils/errors.js';
import type { PaginatedResponse } from '../types/index.js';
import type { Campaign } from '../database/schema/campaigns.js';

export class CampaignService {
  private repo: CampaignRepository;

  constructor(d1: D1Database) {
    this.repo = new CampaignRepository(d1);
  }

  async list(
    params: { page?: number; limit?: number; q?: string | undefined; includeDeleted?: boolean },
  ): Promise<PaginatedResponse<Campaign>> {
    const pagination = parsePagination(params.page, params.limit);
    const { data, total } = await this.repo.findAll(pagination, {
      q: params.q,
      includeDeleted: params.includeDeleted,
    });
    return buildPaginatedResponse(data, total, pagination);
  }

  async getById(id: string): Promise<Campaign> {
    const campaign = await this.repo.findById(id);
    if (!campaign) throw new NotFoundError('Campaign', id);
    return campaign;
  }

  async create(input: CreateCampaignInput): Promise<Campaign> {
    return this.repo.create(input);
  }

  async update(id: string, input: UpdateCampaignInput): Promise<Campaign> {
    await this.getById(id);
    const updated = await this.repo.update(id, input);
    if (!updated) throw new NotFoundError('Campaign', id);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.repo.softDelete(id);
    if (!deleted) throw new NotFoundError('Campaign', id);
  }
}
