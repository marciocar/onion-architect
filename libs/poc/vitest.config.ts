import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/fixtures.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@onion/poc': path.resolve(__dirname, './src'),
    },
  },
});

