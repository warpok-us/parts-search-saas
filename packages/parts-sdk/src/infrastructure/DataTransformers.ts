import { DataTransformer } from '../contracts/index.js';

/**
 * Date transformer that converts ISO strings to Date objects
 * Follows Single Responsibility Principle - only handles date transformation
 */
export class DateTransformer implements DataTransformer {
  private readonly dateFields = ['createdAt', 'updatedAt', 'timestamp', 'date'];

  transform(obj: unknown): unknown {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.transform(item));
    }

    const result = { ...obj as Record<string, unknown> };
    
    // Transform known date fields
    for (const field of this.dateFields) {
      if (result[field] && typeof result[field] === 'string') {
        try {
          result[field] = new Date(result[field] as string);
        } catch {
          // If date parsing fails, keep original value
        }
      }
    }

    // Recursively transform nested objects
    for (const [key, value] of Object.entries(result)) {
      if (value && typeof value === 'object') {
        result[key] = this.transform(value);
      }
    }

    return result;
  }
}

/**
 * No-op transformer that returns data as-is
 */
export class IdentityTransformer implements DataTransformer {
  transform(data: unknown): unknown {
    return data;
  }
}

/**
 * Composite transformer that applies multiple transformers in sequence
 */
export class CompositeTransformer implements DataTransformer {
  constructor(private transformers: DataTransformer[]) {}

  transform(data: unknown): unknown {
    return this.transformers.reduce((current, transformer) => {
      return transformer.transform(current);
    }, data);
  }
}
