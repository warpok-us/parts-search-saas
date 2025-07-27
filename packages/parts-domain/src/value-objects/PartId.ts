import { ValueObject, ValidationError } from '@partsy/shared-utils';

export class PartId extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('PartId cannot be empty');
    }
    super(value.trim());
  }

  public static generate(): PartId {
    return new PartId(crypto.randomUUID());
  }
}

export class PartNumber extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Part number cannot be empty');
    }
    if (value.length > 50) {
      throw new ValidationError('Part number cannot exceed 50 characters');
    }
    super(value.trim().toUpperCase());
  }
}

export class PartName extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Part name cannot be empty');
    }
    if (value.length > 200) {
      throw new ValidationError('Part name cannot exceed 200 characters');
    }
    super(value.trim());
  }
}

export class Price extends ValueObject<number> {
  constructor(value: number) {
    if (value < 0) {
      throw new ValidationError('Price cannot be negative');
    }
    if (!Number.isFinite(value)) {
      throw new ValidationError('Price must be a valid number');
    }
    super(Math.round(value * 100) / 100); // Round to 2 decimal places
  }
}

export class Quantity extends ValueObject<number> {
  constructor(value: number) {
    if (value < 0) {
      throw new ValidationError('Quantity cannot be negative');
    }
    if (!Number.isInteger(value)) {
      throw new ValidationError('Quantity must be an integer');
    }
    super(value);
  }
}

export enum PartStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED'
}

export class Category extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new ValidationError('Category cannot be empty');
    }
    super(value.trim());
  }
}