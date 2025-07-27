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
}

export class PartsAPIClient {
  private config: PartsAPIConfig;

  constructor(config: PartsAPIConfig) {
    this.config = {
      timeout: 5000,
      ...config
    };
  }

  async createPart(dto: CreatePartDTO): Promise<PartDTO> {
    const response = await this.request('POST', '/parts', dto);
    return response.json();
  }

  async searchParts(dto: SearchPartsDTO): Promise<SearchPartsResponseDTO> {
    const queryParams = new URLSearchParams();
    
    Object.entries(dto).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const response = await this.request('GET', `/parts/search?${queryParams.toString()}`);
    return response.json();
  }

  async getPartById(id: string): Promise<PartDTO> {
    const response = await this.request('GET', `/parts/${id}`);
    return response.json();
  }

  async updatePart(id: string, dto: Partial<CreatePartDTO>): Promise<PartDTO> {
    const response = await this.request('PUT', `/parts/${id}`, dto);
    return response.json();
  }

  async deletePart(id: string): Promise<void> {
    await this.request('DELETE', `/parts/${id}`);
  }

  private async request(method: string, path: string, body?: unknown): Promise<Response> {
    const url = `${this.config.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(this.config.timeout!)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response;
  }
}

// Factory function for easy initialization
export function createPartsAPIClient(config: PartsAPIConfig): PartsAPIClient {
  return new PartsAPIClient(config);
}
