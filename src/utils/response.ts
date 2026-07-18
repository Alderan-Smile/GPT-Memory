import type { ApiResponse } from '../types/index.js';

export function ok<T>(data: T, meta?: Record<string, unknown>): ApiResponse<T> {
  return { success: true, data, ...(meta ? { meta } : {}) };
}
