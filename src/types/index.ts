export type Env = {
  DB: D1Database;
  ENVIRONMENT: 'development' | 'production' | 'test';
};

export type AppContext = {
  Bindings: Env;
  Variables: {
    campaignId?: string;
    requestId: string;
  };
};

export type PaginationParams = {
  page: number;
  limit: number;
  offset: number;
};

export type SortParams = {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
};

export type FilterParams = {
  campaignId?: string;
  deletedAt?: boolean;
};

export type ListParams = PaginationParams & SortParams & FilterParams;

export type ApiResponse<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type PaginatedResponse<T> = ApiResponse<T[]> & {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

export type EntityType =
  | 'campaign'
  | 'character'
  | 'location'
  | 'planet'
  | 'star_system'
  | 'ship'
  | 'vehicle'
  | 'object'
  | 'organization'
  | 'event'
  | 'timeline'
  | 'relationship'
  | 'secret'
  | 'player_knowledge'
  | 'world_knowledge'
  | 'quote'
  | 'note'
  | 'session'
  | 'species'
  | 'inventory';
