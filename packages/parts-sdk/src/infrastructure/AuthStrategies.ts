import { AuthenticationStrategy } from '../contracts/index.js';

/**
 * Bearer token authentication strategy
 * Follows Single Responsibility Principle - only handles token authentication
 */
export class BearerTokenAuthStrategy implements AuthenticationStrategy {
  constructor(private token: string) {}

  authenticate(headers: Record<string, string>): Record<string, string> {
    return {
      ...headers,
      'Authorization': `Bearer ${this.token}`,
    };
  }
}

/**
 * API Key authentication strategy
 */
export class ApiKeyAuthStrategy implements AuthenticationStrategy {
  constructor(
    private apiKey: string,
    private headerName: string = 'X-API-Key'
  ) {}

  authenticate(headers: Record<string, string>): Record<string, string> {
    return {
      ...headers,
      [this.headerName]: this.apiKey,
    };
  }
}

/**
 * No authentication strategy
 */
export class NoAuthStrategy implements AuthenticationStrategy {
  authenticate(headers: Record<string, string>): Record<string, string> {
    return headers;
  }
}

/**
 * Basic authentication strategy
 */
export class BasicAuthStrategy implements AuthenticationStrategy {
  constructor(private username: string, private password: string) {}

  authenticate(headers: Record<string, string>): Record<string, string> {
    const credentials = btoa(`${this.username}:${this.password}`);
    return {
      ...headers,
      'Authorization': `Basic ${credentials}`,
    };
  }
}
