import { PartsAPIClient, type PartsAPIConfig, type SearchPartsDTO, type SearchPartsResponseDTO, type PartDTO } from './index.js';
import { getAPIConfig } from './config.js';

export interface ClientFactoryOptions {
  environment?: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  customBaseUrl?: string;
}

export class PartsAPIClientFactory {
  static create(options: ClientFactoryOptions = {}): PartsAPIClient {
    const {
      environment = 'development',
      apiKey,
      customBaseUrl,
      timeout,
      retryAttempts
    } = options;

    const envConfig = getAPIConfig(environment);
    
    const config: PartsAPIConfig = {
      baseUrl: customBaseUrl || envConfig.baseUrl,
      apiKey,
      timeout: timeout || envConfig.timeout,
      retryAttempts: retryAttempts || envConfig.retryAttempts
    };

    return new PartsAPIClient(config);
  }

  static createWithMockData(): MockPartsAPIClient {
    return new MockPartsAPIClient();
  }
}

// Mock client for development/testing
export class MockPartsAPIClient extends PartsAPIClient {
  constructor() {
    super({ baseUrl: 'mock://api' });
  }

  // Override methods with mock data
  async searchParts(dto: SearchPartsDTO): Promise<SearchPartsResponseDTO> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockParts: PartDTO[] = [
      {
        id: '1',
        partNumber: 'ENG-001',
        name: 'V8 Engine Block',
        description: 'High-performance V8 engine block for sports cars',
        price: 2500.00,
        quantity: 5,
        status: 'ACTIVE',
        category: 'Engine',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      // Add more mock data...
    ];

    // Apply basic filtering
    let filteredParts = mockParts;
    
    if (dto.name) {
      filteredParts = filteredParts.filter(p => 
        p.name.toLowerCase().includes(dto.name!.toLowerCase())
      );
    }
    
    if (dto.category) {
      filteredParts = filteredParts.filter(p => 
        p.category.toLowerCase() === dto.category!.toLowerCase()
      );
    }

    return {
      parts: filteredParts,
      total: filteredParts.length,
      page: dto.page || 1,
      limit: dto.limit || 10,
      totalPages: Math.ceil(filteredParts.length / (dto.limit || 10))
    };
  }

  async getPartById(id: string): Promise<PartDTO> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      id,
      partNumber: 'MOCK-001',
      name: 'Mock Part',
      description: 'This is a mock part for testing',
      price: 100.00,
      quantity: 10,
      status: 'ACTIVE',
      category: 'Mock',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
