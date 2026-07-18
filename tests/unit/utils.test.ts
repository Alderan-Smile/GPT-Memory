import { describe, it, expect } from 'vitest';
import { parsePagination, buildPaginatedResponse } from '../../src/utils/pagination.js';
import { AppError, NotFoundError, ValidationError } from '../../src/utils/errors.js';

describe('parsePagination', () => {
  it('returns defaults when no values provided', () => {
    const result = parsePagination(undefined, undefined);
    expect(result).toEqual({ page: 1, limit: 20, offset: 0 });
  });

  it('clamps limit to 100 max', () => {
    const result = parsePagination(1, 500);
    expect(result.limit).toBe(100);
  });

  it('uses default limit when 0 is passed', () => {
    const result = parsePagination(1, 0);
    expect(result.limit).toBe(20);
  });

  it('calculates correct offset', () => {
    const result = parsePagination(3, 10);
    expect(result.offset).toBe(20);
  });

  it('clamps page to 1 min', () => {
    const result = parsePagination(-5, 10);
    expect(result.page).toBe(1);
    expect(result.offset).toBe(0);
  });
});

describe('buildPaginatedResponse', () => {
  it('builds correct pagination meta', () => {
    const data = [1, 2, 3];
    const result = buildPaginatedResponse(data, 50, { page: 2, limit: 10, offset: 10 });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(data);
    expect(result.meta.total).toBe(50);
    expect(result.meta.totalPages).toBe(5);
    expect(result.meta.hasNext).toBe(true);
    expect(result.meta.hasPrev).toBe(true);
  });

  it('reports no next on last page', () => {
    const result = buildPaginatedResponse([], 20, { page: 2, limit: 20, offset: 20 });
    expect(result.meta.hasNext).toBe(false);
    expect(result.meta.hasPrev).toBe(true);
  });

  it('reports no prev on first page', () => {
    const result = buildPaginatedResponse([], 5, { page: 1, limit: 20, offset: 0 });
    expect(result.meta.hasPrev).toBe(false);
  });
});

describe('AppError', () => {
  it('creates error with correct properties', () => {
    const error = new AppError('TEST_CODE', 'Test message', 400, { field: 'value' });
    expect(error.code).toBe('TEST_CODE');
    expect(error.message).toBe('Test message');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual({ field: 'value' });
  });
});

describe('NotFoundError', () => {
  it('creates 404 error with resource name', () => {
    const error = new NotFoundError('Campaign', 'abc-123');
    expect(error.statusCode).toBe(404);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toContain('Campaign');
    expect(error.message).toContain('abc-123');
  });
});

describe('ValidationError', () => {
  it('creates 422 error', () => {
    const error = new ValidationError('Invalid input');
    expect(error.statusCode).toBe(422);
    expect(error.code).toBe('VALIDATION_ERROR');
  });
});
