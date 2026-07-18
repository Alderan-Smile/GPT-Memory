import type { Context, Next } from 'hono';
import type { AppContext } from '../types/index.js';

export async function loggerMiddleware(
  c: Context<AppContext>,
  next: Next,
): Promise<void> {
  const requestId = crypto.randomUUID();
  c.set('requestId', requestId);

  const start = Date.now();
  const { method, url } = c.req.raw;

  await next();

  const elapsed = Date.now() - start;
  const status = c.res.status;

  console.log(
    JSON.stringify({
      requestId,
      method,
      url,
      status,
      elapsed,
      timestamp: new Date().toISOString(),
    }),
  );
}
