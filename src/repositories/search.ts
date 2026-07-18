import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../database/schema/index.js';
import type { SearchQuery } from '../validators/search.js';

export type SearchResult = {
  entityId: string;
  entityType: string;
  campaignId: string;
  content: string;
  rank?: number;
};

export class SearchRepository {
  private db: ReturnType<typeof drizzle<typeof schema>>;
  private d1: D1Database;

  constructor(d1: D1Database) {
    this.d1 = d1;
    this.db = drizzle(d1, { schema });
  }

  /**
   * Index an entity into the FTS5 virtual table.
   * Call this after creating/updating any searchable entity.
   */
  async indexEntity(
    entityId: string,
    entityType: string,
    campaignId: string,
    content: string,
  ): Promise<void> {
    // Delete existing index entry
    await this.d1
      .prepare(
        `DELETE FROM fts_index WHERE entity_id = ? AND entity_type = ?`,
      )
      .bind(entityId, entityType)
      .run();

    // Insert new index entry
    await this.d1
      .prepare(
        `INSERT INTO fts_index(entity_id, entity_type, campaign_id, content) VALUES (?, ?, ?, ?)`,
      )
      .bind(entityId, entityType, campaignId, content)
      .run();
  }

  async removeFromIndex(entityId: string, entityType: string): Promise<void> {
    await this.d1
      .prepare(`DELETE FROM fts_index WHERE entity_id = ? AND entity_type = ?`)
      .bind(entityId, entityType)
      .run();
  }

  async search(query: SearchQuery): Promise<{ data: SearchResult[]; total: number }> {
    const { q, campaignId, types, page = 1, limit = 20 } = query;
    const offset = (page - 1) * limit;

    let sql = `
      SELECT entity_id, entity_type, campaign_id, content, rank
      FROM fts_index
      WHERE content MATCH ?
    `;
    const params: unknown[] = [q];

    if (campaignId) {
      sql += ` AND campaign_id = ?`;
      params.push(campaignId);
    }

    if (types && types.length > 0) {
      const placeholders = types.map(() => '?').join(', ');
      sql += ` AND entity_type IN (${placeholders})`;
      params.push(...types);
    }

    sql += ` ORDER BY rank LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const countSql = sql.replace(
      /SELECT entity_id.*?FROM fts_index/s,
      'SELECT COUNT(*) as total FROM fts_index',
    ).replace(/ ORDER BY rank LIMIT \? OFFSET \?$/, '');

    const [results, countResult] = await Promise.all([
      this.d1
        .prepare(sql)
        .bind(...params)
        .all<SearchResult>(),
      this.d1
        .prepare(
          `SELECT COUNT(*) as total FROM fts_index WHERE content MATCH ?${campaignId ? ' AND campaign_id = ?' : ''}${types && types.length > 0 ? ` AND entity_type IN (${types.map(() => '?').join(', ')})` : ''}`,
        )
        .bind(...params.slice(0, params.length - 2))
        .first<{ total: number }>(),
    ]);

    return {
      data: results.results ?? [],
      total: countResult?.total ?? 0,
    };
  }
}
