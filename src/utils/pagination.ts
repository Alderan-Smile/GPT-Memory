import type { PaginationParams, PaginatedResponse } from '../types/index.js';

export function parsePagination(
  page: unknown,
  limit: unknown,
): PaginationParams {
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  return {
    page: parsedPage,
    limit: parsedLimit,
    offset: (parsedPage - 1) * parsedLimit,
  };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams,
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / pagination.limit);
  return {
    success: true,
    data,
    meta: {
      page: pagination.page,
      limit: pagination.limit,
      total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
}
