import { defineConfig } from 'vitest/config';
import { resolve, dirname, extname } from 'path';
import { existsSync } from 'fs';
import type { Plugin } from 'vite';

/**
 * Resolves TypeScript source files for Vitest.
 * Handles two cases:
 * 1. `.js` extension imports that should resolve to `.ts` files
 * 2. Extension-less imports that should resolve to `.ts` files
 */
const resolveTs: Plugin = {
  name: 'resolve-ts',
  enforce: 'pre',
  resolveId(id: string, importer?: string) {
    if (!importer || id.startsWith('\0') || !id.match(/^\.{1,2}\//)) return null;

    const base = dirname(importer);

    // Case 1: .js extension → .ts
    if (id.endsWith('.js')) {
      const abs = resolve(base, id.replace(/\.js$/, '.ts'));
      if (existsSync(abs)) return abs;
    }

    // Case 2: No extension → .ts or /index.ts
    if (!extname(id)) {
      const abs = resolve(base, id + '.ts');
      if (existsSync(abs)) return abs;
      const idx = resolve(base, id, 'index.ts');
      if (existsSync(idx)) return idx;
    }

    return null;
  },
};

export default defineConfig({
  plugins: [resolveTs],
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/index.ts', 'src/types/**', 'src/database/schema/**'],
    },
  },
  resolve: {
    alias: [
      { find: '@', replacement: resolve(__dirname, 'src') },
    ],
  },
});
