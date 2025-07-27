// Public SDK interfaces - stateless and self-contained
export interface PartDTO {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchPartsDTO {
  name?: string;
  partNumber?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchPartsResponseDTO {
  parts: PartDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePartDTO {
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
}

export interface PartsAPIConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

// Re-export errors and config
export * from './errors.js';
export * from './config.js';
export * from './factory.js';
import { APIError, NetworkError } from './errors.js';

export class PartsAPIClient {
  private config: PartsAPIConfig & {
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };

  constructor(config: PartsAPIConfig) {
    this.config = {
      timeout: 5000,
      retryAttempts: 3,
      retryDelay: 1000,
      ...config
    };
  }

  async createPart(dto: CreatePartDTO): Promise<PartDTO> {
    const response = await this.request('POST', '/parts', dto);
    return this.parseResponse<PartDTO>(response);
  }

  async searchParts(dto: SearchPartsDTO): Promise<SearchPartsResponseDTO> {
    const queryParams = new URLSearchParams();
    
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const url = queryParams.toString() ? `/parts/search?${queryParams.toString()}` : '/parts/search';
    const response = await this.request('GET', url);
    return this.parseResponse<SearchPartsResponseDTO>(response);
  }

  async getPartById(id: string): Promise<PartDTO> {
    const response = await this.request('GET', `/parts/${encodeURIComponent(id)}`);
    return this.parseResponse<PartDTO>(response);
  }

  async updatePart(id: string, dto: Partial<CreatePartDTO>): Promise<PartDTO> {
    const response = await this.request('PUT', `/parts/${encodeURIComponent(id)}`, dto);
    return this.parseResponse<PartDTO>(response);
  }

  async deletePart(id: string): Promise<void> {
    await this.request('DELETE', `/parts/${encodeURIComponent(id)}`);
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      throw new APIError(`Expected JSON response, got ${contentType}`, response.status, response.statusText, response);
    }

    try {
      const data = await response.json();
      return this.transformDates(data);
    } catch (error) {
      throw new APIError('Failed to parse JSON response', response.status, response.statusText, response);
    }
  }

  private transformDates(obj: any): any {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformDates(item));
    }

    const result = { ...obj };
    
    // Transform known date fields
    const dateFields = ['createdAt', 'updatedAt'];
    for (const field of dateFields) {
      if (result[field] && typeof result[field] === 'string') {
        result[field] = new Date(result[field]);
      }
    }

    // Recursively transform nested objects
    for (const [key, value] of Object.entries(result)) {
      if (value && typeof value === 'object') {
        result[key] = this.transformDates(value);
      }
    }

    return result;
  }

  private async request(method: string, path: string, body?: unknown): Promise<Response> {
    const url = `${this.config.baseUrl}${path}`;
    
    for (let attempt = 1; attempt <= this.config.retryAttempts; attempt++) {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        if (this.config.apiKey) {
          headers['Authorization'] = `Bearer ${this.config.apiKey}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await this.safeParseError(response);
          throw new APIError(
            errorData.message || `API request failed: ${response.status} ${response.statusText}`,
            response.status,
            response.statusText,
            response
          );
        }

        return response;
      } catch (error: unknown) {
        const isLastAttempt = attempt === this.config.retryAttempts;
        
        if (error instanceof APIError) {
          // Don't retry client errors (4xx)
          if (error.status && error.status >= 400 && error.status < 500) {
            throw error;
          }
        }

        if (isLastAttempt) {
          if (error instanceof TypeError && error.message.includes('fetch')) {
            throw new NetworkError('Network connection failed. Please check your internet connection.');
          }
          throw error;
        }

        // Wait before retry with exponential backoff
        await this.delay(this.config.retryDelay * Math.pow(2, attempt - 1));
      }
    }

    throw new NetworkError('Max retry attempts exceeded');
  }

  private async safeParseError(response: Response): Promise<{ message?: string }> {
    try {
      const clone = response.clone();
      return await clone.json();
    } catch {
      return {};
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Factory function for easy initialization
export function createPartsAPIClient(config: PartsAPIConfig): PartsAPIClient {
  return new PartsAPIClient(config);
}
