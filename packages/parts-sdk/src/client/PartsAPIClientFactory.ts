import { PartsAPIClient, PartsAPIClientConfig } from './PartsAPIClient.js';
import { FetchHttpClient } from '../infrastructure/FetchHttpClient.js';
import { 
  ExponentialBackoffRetryStrategy, 
  NoRetryStrategy, 
  FixedDelayRetryStrategy 
} from '../infrastructure/RetryStrategies.js';
import { 
  BearerTokenAuthStrategy, 
  ApiKeyAuthStrategy, 
  NoAuthStrategy,
  BasicAuthStrategy 
} from '../infrastructure/AuthStrategies.js';
import { 
  DateTransformer, 
  IdentityTransformer, 
  CompositeTransformer 
} from '../infrastructure/DataTransformers.js';
import {
  HttpClient,
  RetryStrategy,
  AuthenticationStrategy,
  DataTransformer,
} from '../contracts/index.js';

/**
 * Builder pattern for creating PartsAPIClient with different configurations
 * Follows Builder pattern and provides fluent interface
 */
export class PartsAPIClientBuilder {
  private baseUrl: string = '';
  private httpClient: HttpClient = new FetchHttpClient();
  private retryStrategy: RetryStrategy = new ExponentialBackoffRetryStrategy();
  private authStrategy: AuthenticationStrategy = new NoAuthStrategy();
  private dataTransformer: DataTransformer = new DateTransformer();

  /**
   * Set the base URL for the API
   */
  setBaseUrl(url: string): PartsAPIClientBuilder {
    this.baseUrl = url;
    return this;
  }

  /**
   * Set a custom HTTP client
   */
  setHttpClient(client: HttpClient): PartsAPIClientBuilder {
    this.httpClient = client;
    return this;
  }

  /**
   * Configure exponential backoff retry strategy
   */
  withExponentialBackoffRetry(maxAttempts = 3, baseDelay = 1000, maxDelay = 10000): PartsAPIClientBuilder {
    this.retryStrategy = new ExponentialBackoffRetryStrategy(maxAttempts, baseDelay, maxDelay);
    return this;
  }

  /**
   * Configure fixed delay retry strategy
   */
  withFixedDelayRetry(maxAttempts = 3, delay = 1000): PartsAPIClientBuilder {
    this.retryStrategy = new FixedDelayRetryStrategy(maxAttempts, delay);
    return this;
  }

  /**
   * Disable retry
   */
  withNoRetry(): PartsAPIClientBuilder {
    this.retryStrategy = new NoRetryStrategy();
    return this;
  }

  /**
   * Set custom retry strategy
   */
  setRetryStrategy(strategy: RetryStrategy): PartsAPIClientBuilder {
    this.retryStrategy = strategy;
    return this;
  }

  /**
   * Configure Bearer token authentication
   */
  withBearerToken(token: string): PartsAPIClientBuilder {
    this.authStrategy = new BearerTokenAuthStrategy(token);
    return this;
  }

  /**
   * Configure API key authentication
   */
  withApiKey(apiKey: string, headerName = 'X-API-Key'): PartsAPIClientBuilder {
    this.authStrategy = new ApiKeyAuthStrategy(apiKey, headerName);
    return this;
  }

  /**
   * Configure basic authentication
   */
  withBasicAuth(username: string, password: string): PartsAPIClientBuilder {
    this.authStrategy = new BasicAuthStrategy(username, password);
    return this;
  }

  /**
   * Set custom authentication strategy
   */
  setAuthStrategy(strategy: AuthenticationStrategy): PartsAPIClientBuilder {
    this.authStrategy = strategy;
    return this;
  }

  /**
   * Enable date transformation (default)
   */
  withDateTransformation(): PartsAPIClientBuilder {
    this.dataTransformer = new DateTransformer();
    return this;
  }

  /**
   * Disable data transformation
   */
  withNoTransformation(): PartsAPIClientBuilder {
    this.dataTransformer = new IdentityTransformer();
    return this;
  }

  /**
   * Set multiple data transformers
   */
  withTransformers(...transformers: DataTransformer[]): PartsAPIClientBuilder {
    this.dataTransformer = new CompositeTransformer(transformers);
    return this;
  }

  /**
   * Set custom data transformer
   */
  setDataTransformer(transformer: DataTransformer): PartsAPIClientBuilder {
    this.dataTransformer = transformer;
    return this;
  }

  /**
   * Build the configured PartsAPIClient
   */
  build(): PartsAPIClient {
    if (!this.baseUrl) {
      throw new Error('Base URL is required. Use setBaseUrl() to configure it.');
    }

    const config: PartsAPIClientConfig = {
      baseUrl: this.baseUrl,
      httpClient: this.httpClient,
      retryStrategy: this.retryStrategy,
      authStrategy: this.authStrategy,
      dataTransformer: this.dataTransformer,
    };

    return new PartsAPIClient(config);
  }
}

/**
 * Factory methods for common configurations
 */
export class PartsAPIClientFactory {
  /**
   * Create a simple client with basic configuration
   */
  static createSimple(baseUrl: string, apiKey?: string): PartsAPIClient {
    const builder = new PartsAPIClientBuilder()
      .setBaseUrl(baseUrl)
      .withDateTransformation()
      .withExponentialBackoffRetry();

    if (apiKey) {
      builder.withBearerToken(apiKey);
    }

    return builder.build();
  }

  /**
   * Create a production-ready client with robust configuration
   */
  static createProduction(baseUrl: string, apiKey: string): PartsAPIClient {
    return new PartsAPIClientBuilder()
      .setBaseUrl(baseUrl)
      .withBearerToken(apiKey)
      .withExponentialBackoffRetry(3, 1000, 10000)
      .withDateTransformation()
      .build();
  }

  /**
   * Create a development client with no retries for faster feedback
   */
  static createDevelopment(baseUrl: string, apiKey?: string): PartsAPIClient {
    const builder = new PartsAPIClientBuilder()
      .setBaseUrl(baseUrl)
      .withNoRetry()
      .withDateTransformation();

    if (apiKey) {
      builder.withBearerToken(apiKey);
    }

    return builder.build();
  }

  /**
   * Create a mock client for testing
   */
  static createMock(): PartsAPIClient {
    // This would return a mock implementation
    // For now, we'll return the same as development
    return new PartsAPIClientBuilder()
      .setBaseUrl('mock://api')
      .withNoRetry()
      .withNoTransformation()
      .build();
  }

  /**
   * Get a builder for custom configuration
   */
  static builder(): PartsAPIClientBuilder {
    return new PartsAPIClientBuilder();
  }
}
