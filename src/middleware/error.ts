import type { Context, Next } from 'hono';
import { ZodError } from 'zod';
import { AppError } from '../utils/errors.js';
import type { AppContext } from '../types/index.js';

export async function errorMiddleware(
  c: Context<AppContext>,
  next: Next,
): Promise<Response> {
  try {
    await next();
    return c.res;
  } catch (err) {
    if (err instanceof AppError) {
      return c.json(
        {
          success: false,
          error: {
            code: err.code,
            message: err.message,
            ...(err.details !== undefined ? { details: err.details } : {}),
          },
        },
        err.statusCode as Parameters<typeof c.json>[1],
      );
    }

    if (err instanceof ZodError) {
      return c.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Request validation failed',
            details: err.flatten(),
          },
        },
        422,
      );
    }

    console.error('[ERROR]', err);

    return c.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      500,
    );
  }
}
