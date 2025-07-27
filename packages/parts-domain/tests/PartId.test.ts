import { describe, it, expect } from 'vitest';
import { PartId, PartNumber, PartName, Price } from '../src/index.js';

describe('PartId', () => {
  it('should create a valid PartId', () => {
    const id = new PartId('test-id-123');
    expect(id.getValue()).toBe('test-id-123');
  });

  it('should trim whitespace', () => {
    const id = new PartId('  test-id-123  ');
    expect(id.getValue()).toBe('test-id-123');
  });

  it('should throw error for empty value', () => {
    expect(() => new PartId('')).toThrow('PartId cannot be empty');
    expect(() => new PartId('   ')).toThrow('PartId cannot be empty');
  });

  it('should generate unique IDs', () => {
    const id1 = PartId.generate();
    const id2 = PartId.generate();
    expect(id1.getValue()).not.toBe(id2.getValue());
    expect(id1.getValue()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });
});

describe('PartNumber', () => {
  it('should create a valid PartNumber', () => {
    const partNumber = new PartNumber('abc123');
    expect(partNumber.getValue()).toBe('ABC123');
  });

  it('should convert to uppercase', () => {
    const partNumber = new PartNumber('abc123');
    expect(partNumber.getValue()).toBe('ABC123');
  });

  it('should throw error for empty value', () => {
    expect(() => new PartNumber('')).toThrow('Part number cannot be empty');
  });

  it('should throw error for too long value', () => {
    const longString = 'a'.repeat(51);
    expect(() => new PartNumber(longString)).toThrow('Part number cannot exceed 50 characters');
  });
});

describe('PartName', () => {
  it('should create a valid PartName', () => {
    const partName = new PartName('Test Part');
    expect(partName.getValue()).toBe('Test Part');
  });

  it('should throw error for empty value', () => {
    expect(() => new PartName('')).toThrow('Part name cannot be empty');
  });

  it('should throw error for too long value', () => {
    const longString = 'a'.repeat(201);
    expect(() => new PartName(longString)).toThrow('Part name cannot exceed 200 characters');
  });
});

describe('Price', () => {
  it('should create a valid Price', () => {
    const price = new Price(10.99);
    expect(price.getValue()).toBe(10.99);
  });

  it('should round to 2 decimal places', () => {
    const price = new Price(10.999);
    expect(price.getValue()).toBe(11);
  });

  it('should throw error for negative value', () => {
    expect(() => new Price(-1)).toThrow('Price cannot be negative');
  });

  it('should throw error for invalid number', () => {
    expect(() => new Price(NaN)).toThrow('Price must be a valid number');
    expect(() => new Price(Infinity)).toThrow('Price must be a valid number');
  });
});