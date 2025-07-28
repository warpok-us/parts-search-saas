// Basic test to ensure the package exports work correctly
import { describe, it, expect } from 'vitest';

describe('Parts Application Package', () => {
  it('should export all modules without errors', async () => {
    // Test that the main index exports work
    const exports = await import('../src/index');
    expect(exports).toBeDefined();
  });
});
