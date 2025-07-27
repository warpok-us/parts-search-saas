// SOLID-compliant SDK exports

// Core contracts and interfaces
export * from './contracts/index.js';

// Infrastructure implementations
export * from './infrastructure/FetchHttpClient.js';
export * from './infrastructure/RetryStrategies.js';
export * from './infrastructure/AuthStrategies.js';
export * from './infrastructure/DataTransformers.js';

// Client implementations
export { PartsAPIClient as SOLIDPartsAPIClient, type PartsAPIClientConfig } from './client/PartsAPIClient.js';
export { MockPartsAPIClient } from './client/MockPartsAPIClient.js';
export { PartsAPIClientFactory, PartsAPIClientBuilder } from './client/PartsAPIClientFactory.js';

// Error types
export * from './errors.js';

// Configuration
export * from './config.js';

// Legacy exports for backward compatibility
export { PartsAPIClient as LegacyPartsAPIClient } from './index.js';
export { PartsAPIClientFactory as LegacyFactory } from './factory.js';

// Re-export commonly used types from application layer
export type {
  SearchPartsDTO,
  SearchPartsResponseDTO,
  PartDTO,
  CreatePartDTO
} from './contracts/index.js';

// Default factory for easy usage
import { PartsAPIClientFactory } from './client/PartsAPIClientFactory.js';
export const createPartsAPIClient = PartsAPIClientFactory.createSimple;
export const PartsAPIBuilder = PartsAPIClientFactory.builder;

/**
 * Quick start examples:
 * 
 * // Simple usage
 * const client = createPartsAPIClient('https://api.example.com', 'your-api-key');
 * 
 * // Builder pattern
 * const client = PartsAPIBuilder()
 *   .setBaseUrl('https://api.example.com')
 *   .withBearerToken('your-token')
 *   .withExponentialBackoffRetry(3, 1000, 10000)
 *   .withDateTransformation()
 *   .build();
 * 
 * // Factory methods
 * const prodClient = PartsAPIClientFactory.createProduction('https://api.example.com', 'prod-key');
 * const devClient = PartsAPIClientFactory.createDevelopment('https://dev-api.example.com');
 * const mockClient = PartsAPIClientFactory.createMock();
 */
