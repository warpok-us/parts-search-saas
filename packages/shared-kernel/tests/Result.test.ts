import { describe, it, expect } from 'vitest';
import { Result } from '../src/index.js';

describe('Result', () => {
  describe('ok', () => {
    it('should create a successful result', () => {
      const result = Result.ok('test value');
      
      expect(result.isSuccess()).toBe(true);
      expect(result.isFailure()).toBe(false);
      expect(result.getValue()).toBe('test value');
    });
  });

  describe('fail', () => {
    it('should create a failed result', () => {
      const result = Result.fail('error message');
      
      expect(result.isSuccess()).toBe(false);
      expect(result.isFailure()).toBe(true);
      expect(result.getError()).toBe('error message');
    });

    it('should throw when trying to get value from failed result', () => {
      const result = Result.fail('error message');
      
      expect(() => result.getValue()).toThrow('Cannot get value from failed result');
    });
  });

  describe('getError', () => {
    it('should throw when trying to get error from successful result', () => {
      const result = Result.ok('test');
      
      expect(() => result.getError()).toThrow('Cannot get error from successful result');
    });
  });
});