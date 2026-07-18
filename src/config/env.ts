import type { Env } from '../types/index.js';

export function getEnv(env: Env) {
  return {
    db: env.DB,
    environment: env.ENVIRONMENT ?? 'production',
  } as const;
}
