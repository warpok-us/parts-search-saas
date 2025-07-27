import { PartsAPIClient, type PartsAPIConfig, type SearchPartsDTO, type SearchPartsResponseDTO, type PartDTO, type CreatePartDTO } from './index.js';
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
export class MockPartsAPIClient {
  public config: PartsAPIConfig;

  constructor() {
    this.config = { baseUrl: 'mock://api' };
  }

  // Implement the same interface as PartsAPIClient
  async createPart(dto: CreatePartDTO): Promise<PartDTO> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate a mock part with the provided data
    const newPart: PartDTO = {
      id: `mock-${Date.now()}`,
      partNumber: dto.partNumber,
      name: dto.name,
      description: dto.description || '',
      price: dto.price,
      quantity: dto.quantity,
      status: 'ACTIVE',
      category: dto.category,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    return newPart;
  }

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
      const nameFilter = dto.name.toLowerCase();
      filteredParts = filteredParts.filter(p => 
        p.name.toLowerCase().includes(nameFilter)
      );
    }
    
    if (dto.category) {
      const categoryFilter = dto.category.toLowerCase();
      filteredParts = filteredParts.filter(p => 
        p.category.toLowerCase() === categoryFilter
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

  async updatePart(id: string, dto: Partial<CreatePartDTO>): Promise<PartDTO> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      id,
      partNumber: dto.partNumber || 'MOCK-001',
      name: dto.name || 'Mock Part',
      description: dto.description || 'This is a mock part for testing',
      price: dto.price || 100.00,
      quantity: dto.quantity || 10,
      status: 'ACTIVE',
      category: dto.category || 'Mock',
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
      updatedAt: new Date()
    };
  }

  async deletePart(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200));
    // Mock delete - nothing to return
  }
}
