import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90
      },
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.test.tsx',
        'apps/**',  // Exclude demo apps from coverage
        'packages/parts-infrastructure/**', // Private implementation
        'packages/parts-application/**'     // Private implementation
      ]
    }
  }
});
