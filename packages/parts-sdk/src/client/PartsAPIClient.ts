import {
  HttpClient,
  HttpRequestOptions,
  RetryStrategy,
  AuthenticationStrategy,
  DataTransformer,
  PartsAPIClient as IPartsAPIClient,
  SearchPartsDTO,
  SearchPartsResponseDTO,
  PartDTO,
  CreatePartDTO,
} from '../contracts/index.js';
import { APIError } from '../errors.js';

export interface PartsAPIClientConfig {
  baseUrl: string;
  httpClient: HttpClient;
  retryStrategy: RetryStrategy;
  authStrategy: AuthenticationStrategy;
  dataTransformer: DataTransformer;
}

/**
 * Refactored PartsAPIClient following SOLID principles
 * 
 * Single Responsibility: Only coordinates between different strategies and handles API calls
 * Open/Closed: Extensible through dependency injection of strategies
 * Liskov Substitution: Can be substituted with other implementations of PartsAPIClient
 * Interface Segregation: Implements focused interfaces (PartsReader, PartsWriter)
 * Dependency Inversion: Depends on abstractions, not concretions
 */
export class PartsAPIClient implements IPartsAPIClient {
  constructor(private config: PartsAPIClientConfig) {}

  async searchParts(dto: SearchPartsDTO): Promise<SearchPartsResponseDTO> {
    const queryParams = new URLSearchParams();
    
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const path = queryParams.toString() ? `/parts/search?${queryParams.toString()}` : '/parts/search';
    const response = await this.executeRequest<SearchPartsResponseDTO>('GET', path);
    return response;
  }

  async getPartById(id: string): Promise<PartDTO> {
    const path = `/parts/${encodeURIComponent(id)}`;
    return this.executeRequest<PartDTO>('GET', path);
  }

  async createPart(dto: CreatePartDTO): Promise<PartDTO> {
    return this.executeRequest<PartDTO>('POST', '/parts', dto);
  }

  async updatePart(id: string, dto: Partial<CreatePartDTO>): Promise<PartDTO> {
    const path = `/parts/${encodeURIComponent(id)}`;
    return this.executeRequest<PartDTO>('PUT', path, dto);
  }

  async deletePart(id: string): Promise<void> {
    const path = `/parts/${encodeURIComponent(id)}`;
    await this.executeRequest<void>('DELETE', path);
  }

  private async executeRequest<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const url = `${this.config.baseUrl}${path}`;
    
    let lastError: Error | undefined;
    let attempt = 1;

    do {
      try {
        const options: HttpRequestOptions = {
          url,
          method: method as any,
          headers: this.config.authStrategy.authenticate({}),
          body,
        };

        const response = await this.config.httpClient.request<T>(options);

        if (response.status >= 400) {
          throw new APIError(
            `API request failed: ${response.status} ${response.statusText}`,
            response.status,
            response.statusText
          );
        }

        // Transform the response data
        const transformedData = this.config.dataTransformer.transform(response.data) as T;
        return transformedData;

      } catch (error) {
        lastError = error as Error;
        
        if (!this.config.retryStrategy.shouldRetry(attempt, lastError)) {
          throw lastError;
        }

        // Wait before retry
        const delay = this.config.retryStrategy.getRetryDelay(attempt);
        await this.delay(delay);
        attempt++;
      }
    } while (attempt <= this.config.retryStrategy.getMaxAttempts());

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
