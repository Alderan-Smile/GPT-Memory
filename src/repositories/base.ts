import type { DrizzleD1Database } from 'drizzle-orm/d1';
import type * as schema from '../database/schema/index.js';
import { sql, eq, isNull, isNotNull, and, type SQL } from 'drizzle-orm';
import type { PaginationParams, SortParams } from '../types/index.js';
import { generateId } from '../utils/id.js';

export type DB = DrizzleD1Database<typeof schema>;

export abstract class BaseRepository<TSelect, TInsert extends { id?: string }> {
  constructor(protected readonly db: DB) {}

  protected nowSql() {
    return sql`(datetime('now'))`;
  }

  protected newId(): string {
    return generateId();
  }

  protected notDeletedFilter<T extends { deletedAt: unknown }>(
    table: T,
  ): SQL<unknown> {
    return isNull(table.deletedAt as Parameters<typeof isNull>[0]);
  }

  protected applyPagination<T extends SQL | undefined>(
    query: { limit: (n: number) => { offset: (n: number) => unknown } },
    pagination: PaginationParams,
  ) {
    return query.limit(pagination.limit).offset(pagination.offset);
  }
}
