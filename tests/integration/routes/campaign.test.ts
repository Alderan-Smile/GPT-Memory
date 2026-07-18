import { describe, it, expect, vi, beforeEach } from 'vitest';
import app from '../../../src/index.js';
import { CampaignService } from '../../../src/services/campaign.js';

vi.mock('../../src/services/campaign.js');

const mockCampaignResponse = {
  success: true,
  data: [{ id: 'c1', name: 'Test', createdAt: '', updatedAt: '', version: 1, deletedAt: null, description: null, metadata: null }],
  meta: { page: 1, limit: 20, total: 1, totalPages: 1, hasNext: false, hasPrev: false },
};

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const req = new Request('http://localhost/health');
    const env = { DB: {} as D1Database, ENVIRONMENT: 'test' as const };
    const res = await app.fetch(req, env);

    expect(res.status).toBe(200);
    const body = await res.json() as { success: boolean; data: { status: string } };
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('ok');
  });
});

describe('GET /api/campaigns', () => {
  beforeEach(() => {
    vi.mocked(CampaignService).mockImplementation(() => ({
      list: vi.fn().mockResolvedValue(mockCampaignResponse),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CampaignService));
  });

  it('returns paginated campaigns', async () => {
    const req = new Request('http://localhost/api/campaigns');
    const env = { DB: {} as D1Database, ENVIRONMENT: 'test' as const };
    const res = await app.fetch(req, env);

    expect(res.status).toBe(200);
    const body = await res.json() as typeof mockCampaignResponse;
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });
});

describe('POST /api/campaigns', () => {
  it('returns 422 for invalid body', async () => {
    const req = new Request('http://localhost/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'Missing name' }),
    });
    const env = { DB: {} as D1Database, ENVIRONMENT: 'test' as const };
    const res = await app.fetch(req, env);

    expect(res.status).toBe(422);
  });

  it('creates a campaign with valid body', async () => {
    const created = { id: 'new-id', name: 'New Campaign', createdAt: '', updatedAt: '', version: 1, deletedAt: null, description: null, metadata: null };

    vi.mocked(CampaignService).mockImplementation(() => ({
      list: vi.fn(),
      getById: vi.fn(),
      create: vi.fn().mockResolvedValue(created),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CampaignService));

    const req = new Request('http://localhost/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'New Campaign' }),
    });
    const env = { DB: {} as D1Database, ENVIRONMENT: 'test' as const };
    const res = await app.fetch(req, env);

    expect(res.status).toBe(201);
    const body = await res.json() as { success: boolean; data: { name: string } };
    expect(body.data.name).toBe('New Campaign');
  });
});

describe('GET /api/campaigns/:id', () => {
  it('returns 404 when campaign not found', async () => {
    const { NotFoundError } = await import('../../src/utils/errors.js');
    vi.mocked(CampaignService).mockImplementation(() => ({
      list: vi.fn(),
      getById: vi.fn().mockRejectedValue(new NotFoundError('Campaign', 'bad-id')),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    } as unknown as CampaignService));

    const req = new Request('http://localhost/api/campaigns/bad-id');
    const env = { DB: {} as D1Database, ENVIRONMENT: 'test' as const };
    const res = await app.fetch(req, env);

    expect(res.status).toBe(404);
    const body = await res.json() as { success: boolean; error: { code: string } };
    expect(body.success).toBe(false);
    expect(body.error.code).toBe('NOT_FOUND');
  });
});
