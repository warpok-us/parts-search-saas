# SDK Extension Guide - Adding New Features

## Overview

This guide demonstrates how to extend the Parts SDK while maintaining SOLID principles and clean architecture. Each example shows the complete implementation from contracts to concrete classes.

## 🔧 Adding New HTTP Client Implementations

### Example: Adding Node.js HTTP Client

**Step 1: Define Requirements**
- Support Node.js environment
- Handle server-side HTTP requests
- Maintain same interface as FetchHttpClient

**Step 2: Implement the Strategy**
```typescript
// packages/parts-sdk/src/infrastructure/http/NodeHttpClient.ts
import { createRequire } from 'module';
import type { HttpClient, HttpRequestOptions, HttpResponse } from '../../contracts';

const require = createRequire(import.meta.url);
const https = require('https');
const http = require('http');

export class NodeHttpClient implements HttpClient {
  constructor(
    private defaultTimeout: number = 5000,
    private keepAlive: boolean = true
  ) {}

  async request<T>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    return new Promise((resolve, reject) => {
      const url = new URL(options.url);
      const isHttps = url.protocol === 'https:';
      const httpModule = isHttps ? https : http;
      
      const requestOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: options.method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        timeout: options.timeout || this.defaultTimeout
      };

      const req = httpModule.request(requestOptions, (res: any) => {
        let data = '';
        
        res.on('data', (chunk: any) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const response: HttpResponse<T> = {
              data: JSON.parse(data),
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: res.headers
            };
            resolve(response);
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        });
      });

      req.on('error', (error: Error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      if (options.body) {
        req.write(JSON.stringify(options.body));
      }

      req.end();
    });
  }
}
```

**Step 3: Add to Factory**
```typescript
// packages/parts-sdk/src/client/PartsAPIClientFactory.ts
export class PartsAPIClientFactory {
  static createForNodeJS(baseUrl: string, apiKey?: string): PartsAPIClient {
    return new PartsAPIClientBuilder()
      .setBaseUrl(baseUrl)
      .withHttpClient(new NodeHttpClient())
      .withApiKey(apiKey)
      .build();
  }
}
```

**Step 4: Write Tests**
```typescript
// packages/parts-sdk/tests/infrastructure/http/NodeHttpClient.test.ts
import { NodeHttpClient } from '../../../src/infrastructure/http/NodeHttpClient';

describe('NodeHttpClient', () => {
  let client: NodeHttpClient;

  beforeEach(() => {
    client = new NodeHttpClient();
  });

  it('should make GET request successfully', async () => {
    // Mock Node.js http module
    const mockResponse = { data: { id: '1', name: 'Test' } };
    
    // Test implementation
    const response = await client.request({
      url: 'https://api.test.com/parts/1',
      method: 'GET'
    });

    expect(response.data).toEqual(mockResponse.data);
  });
});
```

## 🔄 Adding New Retry Strategies

### Example: Adding Circuit Breaker Pattern

**Step 1: Extend Retry Strategy Interface**
```typescript
// packages/parts-sdk/src/contracts/index.ts
export interface AdvancedRetryStrategy extends RetryStrategy {
  onSuccess?(): void;
  onFailure?(error: Error): void;
  getCircuitState?(): 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}
```

**Step 2: Implement Circuit Breaker**
```typescript
// packages/parts-sdk/src/infrastructure/retry/CircuitBreakerRetryStrategy.ts
import type { AdvancedRetryStrategy } from '../../contracts';

export class CircuitBreakerRetryStrategy implements AdvancedRetryStrategy {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private failureThreshold: number = 5,
    private recoveryTimeoutMs: number = 60000,
    private maxAttempts: number = 3
  ) {}

  shouldRetry(attempt: number, error: Error): boolean {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.recoveryTimeoutMs) {
        this.state = 'HALF_OPEN';
        return attempt <= 1; // Allow one retry attempt
      }
      return false; // Circuit is open, fail fast
    }

    return attempt < this.maxAttempts;
  }

  getRetryDelay(attempt: number): number {
    if (this.state === 'HALF_OPEN') {
      return 1000; // Quick retry in half-open state
    }
    return Math.min(1000 * Math.pow(2, attempt - 1), 30000);
  }

  getMaxAttempts(): number {
    return this.maxAttempts;
  }

  onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure(error: Error): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  getCircuitState(): 'CLOSED' | 'OPEN' | 'HALF_OPEN' {
    return this.state;
  }
}
```

**Step 3: Update PartsAPIClient to Use Advanced Retry**
```typescript
// packages/parts-sdk/src/client/PartsAPIClient.ts
export class PartsAPIClient implements PartsReader, PartsWriter {
  // ... existing code ...

  private async executeWithRetry<T>(
    operation: () => Promise<HttpResponse<T>>
  ): Promise<T> {
    let lastError: Error | null = null;
    const maxAttempts = this.retryStrategy.getMaxAttempts();

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await operation();
        
        // Call success callback if available
        if ('onSuccess' in this.retryStrategy && 
            typeof this.retryStrategy.onSuccess === 'function') {
          this.retryStrategy.onSuccess();
        }

        return this.dataTransformer.transform(response.data);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Call failure callback if available
        if ('onFailure' in this.retryStrategy && 
            typeof this.retryStrategy.onFailure === 'function') {
          this.retryStrategy.onFailure(lastError);
        }

        if (!this.retryStrategy.shouldRetry(attempt, lastError)) {
          break;
        }

        if (attempt < maxAttempts) {
          const delay = this.retryStrategy.getRetryDelay(attempt);
          await this.delay(delay);
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }
}
```

## 🔐 Adding New Authentication Strategies

### Example: Adding OAuth2 with Token Refresh

**Step 1: Extend Authentication Interface**
```typescript
// packages/parts-sdk/src/contracts/index.ts
export interface RefreshableAuthStrategy extends AuthenticationStrategy {
  refreshToken(): Promise<void>;
  isTokenExpired(): boolean;
  getTokenExpiryTime(): Date | null;
}
```

**Step 2: Implement OAuth2 Strategy**
```typescript
// packages/parts-sdk/src/infrastructure/auth/OAuth2AuthStrategy.ts
import type { RefreshableAuthStrategy } from '../../contracts';

export interface OAuth2Config {
  clientId: string;
  clientSecret: string;
  tokenEndpoint: string;
  refreshToken?: string;
  scope?: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

export class OAuth2AuthStrategy implements RefreshableAuthStrategy {
  private accessToken: string | null = null;
  private refreshTokenValue: string | null = null;
  private expiryTime: Date | null = null;

  constructor(
    private config: OAuth2Config,
    private httpClient: HttpClient
  ) {
    this.refreshTokenValue = config.refreshToken || null;
  }

  authenticate(headers: Record<string, string>): Record<string, string> {
    if (!this.accessToken) {
      throw new Error('No access token available. Call refreshToken() first.');
    }

    return {
      ...headers,
      'Authorization': `Bearer ${this.accessToken}`
    };
  }

  async refreshToken(): Promise<void> {
    try {
      const response = await this.httpClient.request<TokenResponse>({
        url: this.config.tokenEndpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: this.buildTokenRequestBody()
      });

      const tokenData = response.data;
      this.accessToken = tokenData.access_token;
      
      if (tokenData.refresh_token) {
        this.refreshTokenValue = tokenData.refresh_token;
      }

      // Calculate expiry time
      const expiresInMs = tokenData.expires_in * 1000;
      this.expiryTime = new Date(Date.now() + expiresInMs);
      
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  isTokenExpired(): boolean {
    if (!this.expiryTime) return true;
    return Date.now() >= this.expiryTime.getTime() - 60000; // 1 minute buffer
  }

  getTokenExpiryTime(): Date | null {
    return this.expiryTime;
  }

  private buildTokenRequestBody(): string {
    const params = new URLSearchParams({
      grant_type: this.refreshTokenValue ? 'refresh_token' : 'client_credentials',
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret
    });

    if (this.refreshTokenValue) {
      params.append('refresh_token', this.refreshTokenValue);
    }

    if (this.config.scope) {
      params.append('scope', this.config.scope);
    }

    return params.toString();
  }
}
```

**Step 3: Create Auto-Refreshing Wrapper**
```typescript
// packages/parts-sdk/src/infrastructure/auth/AutoRefreshAuthStrategy.ts
export class AutoRefreshAuthStrategy implements AuthenticationStrategy {
  constructor(private authStrategy: RefreshableAuthStrategy) {}

  async authenticate(headers: Record<string, string>): Promise<Record<string, string>> {
    // Auto-refresh if token is expired
    if (this.authStrategy.isTokenExpired()) {
      await this.authStrategy.refreshToken();
    }

    return this.authStrategy.authenticate(headers);
  }
}
```

## 🔄 Adding New Data Transformers

### Example: Adding Encryption/Decryption Transformer

**Step 1: Define Encryption Interface**
```typescript
// packages/parts-sdk/src/contracts/index.ts
export interface EncryptionProvider {
  encrypt(data: string): string;
  decrypt(data: string): string;
}
```

**Step 2: Implement Encryption Transformer**
```typescript
// packages/parts-sdk/src/infrastructure/data/EncryptionTransformer.ts
import type { DataTransformer, EncryptionProvider } from '../../contracts';

export class EncryptionTransformer<T = any> implements DataTransformer<T, T> {
  constructor(
    private encryptionProvider: EncryptionProvider,
    private fieldsToEncrypt: string[] = []
  ) {}

  transform(data: T): T {
    if (this.fieldsToEncrypt.length === 0) {
      return data;
    }

    return this.transformObject(data);
  }

  private transformObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.transformObject(item));
    }

    const result = { ...obj };
    
    for (const field of this.fieldsToEncrypt) {
      if (field in result && typeof result[field] === 'string') {
        try {
          result[field] = this.encryptionProvider.decrypt(result[field]);
        } catch (error) {
          // Field might not be encrypted, leave as is
        }
      }
    }

    // Recursively transform nested objects
    for (const key in result) {
      if (typeof result[key] === 'object') {
        result[key] = this.transformObject(result[key]);
      }
    }

    return result;
  }
}

export class DecryptionTransformer<T = any> implements DataTransformer<T, T> {
  constructor(
    private encryptionProvider: EncryptionProvider,
    private fieldsToDecrypt: string[] = []
  ) {}

  transform(data: T): T {
    if (this.fieldsToDecrypt.length === 0) {
      return data;
    }

    return this.transformObject(data);
  }

  private transformObject(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.transformObject(item));
    }

    const result = { ...obj };
    
    for (const field of this.fieldsToDecrypt) {
      if (field in result && typeof result[field] === 'string') {
        try {
          result[field] = this.encryptionProvider.decrypt(result[field]);
        } catch (error) {
          console.warn(`Failed to decrypt field ${field}:`, error.message);
        }
      }
    }

    // Recursively transform nested objects
    for (const key in result) {
      if (typeof result[key] === 'object') {
        result[key] = this.transformObject(result[key]);
      }
    }

    return result;
  }
}
```

**Step 3: Implement Simple Encryption Provider**
```typescript
// packages/parts-sdk/src/infrastructure/encryption/SimpleEncryptionProvider.ts
import type { EncryptionProvider } from '../../contracts';

export class SimpleEncryptionProvider implements EncryptionProvider {
  constructor(private secretKey: string) {}

  encrypt(data: string): string {
    // Simple XOR encryption (use a proper library in production)
    let result = '';
    for (let i = 0; i < data.length; i++) {
      const keyChar = this.secretKey.charCodeAt(i % this.secretKey.length);
      const dataChar = data.charCodeAt(i);
      result += String.fromCharCode(dataChar ^ keyChar);
    }
    return btoa(result); // Base64 encode
  }

  decrypt(data: string): string {
    const decoded = atob(data); // Base64 decode
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const keyChar = this.secretKey.charCodeAt(i % this.secretKey.length);
      const dataChar = decoded.charCodeAt(i);
      result += String.fromCharCode(dataChar ^ keyChar);
    }
    return result;
  }
}
```

## 📊 Adding New Monitoring/Observability Features

### Example: Adding Request Metrics Collection

**Step 1: Define Metrics Interface**
```typescript
// packages/parts-sdk/src/contracts/index.ts
export interface MetricsCollector {
  recordRequest(method: string, url: string, duration: number, status: number): void;
  recordError(method: string, url: string, error: Error): void;
  getMetrics(): RequestMetrics;
}

export interface RequestMetrics {
  totalRequests: number;
  totalErrors: number;
  averageResponseTime: number;
  requestsByMethod: Record<string, number>;
  requestsByStatus: Record<number, number>;
}
```

**Step 2: Implement Metrics Collector**
```typescript
// packages/parts-sdk/src/infrastructure/metrics/RequestMetricsCollector.ts
import type { MetricsCollector, RequestMetrics } from '../../contracts';

export class RequestMetricsCollector implements MetricsCollector {
  private requests: Array<{
    method: string;
    url: string;
    duration: number;
    status: number;
    timestamp: Date;
  }> = [];

  private errors: Array<{
    method: string;
    url: string;
    error: Error;
    timestamp: Date;
  }> = [];

  recordRequest(method: string, url: string, duration: number, status: number): void {
    this.requests.push({
      method,
      url,
      duration,
      status,
      timestamp: new Date()
    });

    // Keep only last 1000 requests to prevent memory leaks
    if (this.requests.length > 1000) {
      this.requests = this.requests.slice(-1000);
    }
  }

  recordError(method: string, url: string, error: Error): void {
    this.errors.push({
      method,
      url,
      error,
      timestamp: new Date()
    });

    // Keep only last 1000 errors
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-1000);
    }
  }

  getMetrics(): RequestMetrics {
    const totalRequests = this.requests.length;
    const totalErrors = this.errors.length;
    
    const averageResponseTime = totalRequests > 0
      ? this.requests.reduce((sum, req) => sum + req.duration, 0) / totalRequests
      : 0;

    const requestsByMethod = this.requests.reduce((acc, req) => {
      acc[req.method] = (acc[req.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const requestsByStatus = this.requests.reduce((acc, req) => {
      acc[req.status] = (acc[req.status] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalRequests,
      totalErrors,
      averageResponseTime,
      requestsByMethod,
      requestsByStatus
    };
  }

  // Additional methods for detailed analysis
  getRequestsInTimeRange(start: Date, end: Date) {
    return this.requests.filter(req => 
      req.timestamp >= start && req.timestamp <= end
    );
  }

  getErrorsInTimeRange(start: Date, end: Date) {
    return this.errors.filter(err => 
      err.timestamp >= start && err.timestamp <= end
    );
  }
}
```

**Step 3: Create Metrics-Aware HTTP Client Wrapper**
```typescript
// packages/parts-sdk/src/infrastructure/http/MetricsHttpClient.ts
import type { HttpClient, HttpRequestOptions, HttpResponse, MetricsCollector } from '../../contracts';

export class MetricsHttpClient implements HttpClient {
  constructor(
    private httpClient: HttpClient,
    private metricsCollector: MetricsCollector
  ) {}

  async request<T>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
    const startTime = Date.now();
    
    try {
      const response = await this.httpClient.request<T>(options);
      const duration = Date.now() - startTime;
      
      this.metricsCollector.recordRequest(
        options.method,
        options.url,
        duration,
        response.status
      );
      
      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.metricsCollector.recordError(
        options.method,
        options.url,
        error instanceof Error ? error : new Error(String(error))
      );
      
      throw error;
    }
  }
}
```

**Step 4: Add to Builder Pattern**
```typescript
// packages/parts-sdk/src/client/PartsAPIClientBuilder.ts
export class PartsAPIClientBuilder {
  // ... existing methods ...

  withMetrics(metricsCollector?: MetricsCollector): this {
    const collector = metricsCollector || new RequestMetricsCollector();
    this.httpClient = new MetricsHttpClient(this.httpClient, collector);
    return this;
  }

  enableMetrics(): this {
    return this.withMetrics();
  }
}

// Usage
const client = new PartsAPIClientBuilder()
  .setBaseUrl('https://api.example.com')
  .enableMetrics()
  .build();

// Get metrics
const metrics = client.getMetrics();
console.log(`Total requests: ${metrics.totalRequests}`);
console.log(`Average response time: ${metrics.averageResponseTime}ms`);
```

## 🧪 Testing New Extensions

### Example: Testing Circuit Breaker Strategy

```typescript
// packages/parts-sdk/tests/infrastructure/retry/CircuitBreakerRetryStrategy.test.ts
import { CircuitBreakerRetryStrategy } from '../../../src/infrastructure/retry/CircuitBreakerRetryStrategy';

describe('CircuitBreakerRetryStrategy', () => {
  let strategy: CircuitBreakerRetryStrategy;

  beforeEach(() => {
    strategy = new CircuitBreakerRetryStrategy(3, 5000, 2); // 3 failures, 5s recovery, 2 max attempts
  });

  describe('circuit states', () => {
    it('should start in CLOSED state', () => {
      expect(strategy.getCircuitState()).toBe('CLOSED');
    });

    it('should open circuit after failure threshold', () => {
      const error = new Error('Test error');
      
      // Record failures
      strategy.onFailure(error);
      strategy.onFailure(error);
      strategy.onFailure(error);
      
      expect(strategy.getCircuitState()).toBe('OPEN');
    });

    it('should reject requests when circuit is open', () => {
      const error = new Error('Test error');
      
      // Open the circuit
      strategy.onFailure(error);
      strategy.onFailure(error);
      strategy.onFailure(error);
      
      expect(strategy.shouldRetry(1, error)).toBe(false);
    });

    it('should transition to HALF_OPEN after recovery timeout', (done) => {
      const error = new Error('Test error');
      
      // Use shorter timeout for testing
      strategy = new CircuitBreakerRetryStrategy(2, 100, 2);
      
      // Open the circuit
      strategy.onFailure(error);
      strategy.onFailure(error);
      
      expect(strategy.getCircuitState()).toBe('OPEN');
      
      setTimeout(() => {
        // Circuit should allow one retry in HALF_OPEN state
        expect(strategy.shouldRetry(1, error)).toBe(true);
        expect(strategy.getCircuitState()).toBe('HALF_OPEN');
        done();
      }, 150);
    });

    it('should close circuit on successful request', () => {
      const error = new Error('Test error');
      
      // Open the circuit
      strategy.onFailure(error);
      strategy.onFailure(error);
      strategy.onFailure(error);
      
      expect(strategy.getCircuitState()).toBe('OPEN');
      
      // Simulate successful request
      strategy.onSuccess();
      
      expect(strategy.getCircuitState()).toBe('CLOSED');
    });
  });
});
```

## 📋 Extension Checklist

When adding new features to the SDK, ensure you:

### ✅ Design Phase
- [ ] Define clear interfaces following ISP
- [ ] Ensure single responsibility (SRP)
- [ ] Plan for extensibility (OCP)
- [ ] Design for substitutability (LSP)
- [ ] Use dependency injection (DIP)

### ✅ Implementation Phase
- [ ] Implement concrete classes
- [ ] Add to factory/builder patterns
- [ ] Include proper error handling
- [ ] Add TypeScript types
- [ ] Follow naming conventions

### ✅ Testing Phase
- [ ] Write unit tests for each class
- [ ] Test interface compliance
- [ ] Add integration tests
- [ ] Test error scenarios
- [ ] Performance testing if applicable

### ✅ Documentation Phase
- [ ] Add code comments
- [ ] Update API documentation
- [ ] Add usage examples
- [ ] Update migration guide
- [ ] Add to quick reference

### ✅ Integration Phase
- [ ] Test with existing code
- [ ] Verify backward compatibility
- [ ] Update export files
- [ ] Run full test suite
- [ ] Update version if needed

## 🚀 Best Practices for Extensions

1. **Start with Interfaces**: Always define the contract first
2. **Keep It Simple**: Each extension should do one thing well
3. **Make It Testable**: Design with testing in mind
4. **Document Everything**: Code should be self-explanatory
5. **Think About Performance**: Consider memory and CPU impact
6. **Plan for Errors**: Handle all failure scenarios
7. **Maintain Consistency**: Follow established patterns
8. **Version Carefully**: Consider breaking changes

This guide provides a framework for extending the SDK while maintaining the high-quality architecture we've established. Each new feature should follow these patterns to ensure consistency and maintainability.
