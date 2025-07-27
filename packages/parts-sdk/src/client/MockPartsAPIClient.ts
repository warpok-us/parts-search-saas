import {
  PartsAPIClient as IPartsAPIClient,
  SearchPartsDTO,
  SearchPartsResponseDTO,
  PartDTO,
  CreatePartDTO,
} from '../contracts/index.js';

/**
 * Mock implementation of PartsAPIClient for testing and development
 * Follows Liskov Substitution Principle - can replace real client without breaking functionality
 */
export class MockPartsAPIClient implements IPartsAPIClient {
  private mockParts: PartDTO[] = [
    {
      id: '1',
      partNumber: 'ENG-001',
      name: 'V8 Engine Block',
      description: 'High-performance V8 engine block for sports cars',
      price: 2500.00,
      quantity: 5,
      status: 'ACTIVE',
      category: 'Engine',
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-01T10:00:00Z')
    },
    {
      id: '2',
      partNumber: 'BRK-002',
      name: 'Carbon Fiber Brake Pads',
      description: 'High-performance carbon fiber brake pads',
      price: 150.00,
      quantity: 25,
      status: 'ACTIVE',
      category: 'Brakes',
      createdAt: new Date('2024-01-02T10:00:00Z'),
      updatedAt: new Date('2024-01-02T10:00:00Z')
    },
    {
      id: '3',
      partNumber: 'SUS-003',
      name: 'Coilover Suspension Kit',
      description: 'Adjustable coilover suspension system',
      price: 800.00,
      quantity: 10,
      status: 'ACTIVE',
      category: 'Suspension',
      createdAt: new Date('2024-01-03T10:00:00Z'),
      updatedAt: new Date('2024-01-03T10:00:00Z')
    }
  ];

  constructor(private networkDelay: number = 300) {}

  async createPart(dto: CreatePartDTO): Promise<PartDTO> {
    await this.simulateNetworkDelay();
    
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
    
    this.mockParts.push(newPart);
    return newPart;
  }

  async searchParts(dto: SearchPartsDTO): Promise<SearchPartsResponseDTO> {
    await this.simulateNetworkDelay();
    
    let filteredParts = [...this.mockParts];
    
    // Apply filters
    if (dto.name) {
      const nameFilter = dto.name.toLowerCase();
      filteredParts = filteredParts.filter(p => 
        p.name.toLowerCase().includes(nameFilter)
      );
    }
    
    if (dto.partNumber) {
      const partNumberFilter = dto.partNumber.toLowerCase();
      filteredParts = filteredParts.filter(p => 
        p.partNumber.toLowerCase().includes(partNumberFilter)
      );
    }
    
    if (dto.category) {
      const categoryFilter = dto.category.toLowerCase();
      filteredParts = filteredParts.filter(p => 
        p.category.toLowerCase() === categoryFilter
      );
    }

    if (dto.status) {
      filteredParts = filteredParts.filter(p => p.status === dto.status);
    }

    if (dto.minPrice !== undefined) {
      filteredParts = filteredParts.filter(p => p.price >= dto.minPrice!);
    }

    if (dto.maxPrice !== undefined) {
      filteredParts = filteredParts.filter(p => p.price <= dto.maxPrice!);
    }

    if (dto.inStock) {
      filteredParts = filteredParts.filter(p => p.quantity > 0);
    }

    // Apply pagination
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedParts = filteredParts.slice(startIndex, endIndex);

    return {
      parts: paginatedParts,
      total: filteredParts.length,
      page,
      limit,
      totalPages: Math.ceil(filteredParts.length / limit)
    };
  }

  async getPartById(id: string): Promise<PartDTO> {
    await this.simulateNetworkDelay();
    
    const part = this.mockParts.find(p => p.id === id);
    if (!part) {
      throw new Error(`Part with id ${id} not found`);
    }
    
    return { ...part }; // Return a copy
  }

  async updatePart(id: string, dto: Partial<CreatePartDTO>): Promise<PartDTO> {
    await this.simulateNetworkDelay();
    
    const partIndex = this.mockParts.findIndex(p => p.id === id);
    if (partIndex === -1) {
      throw new Error(`Part with id ${id} not found`);
    }

    const existingPart = this.mockParts[partIndex]!; // We know it exists due to the check above
    const updatedPart: PartDTO = {
      id: existingPart.id,
      partNumber: dto.partNumber ?? existingPart.partNumber,
      name: dto.name ?? existingPart.name,
      description: dto.description ?? existingPart.description,
      price: dto.price ?? existingPart.price,
      quantity: dto.quantity ?? existingPart.quantity,
      category: dto.category ?? existingPart.category,
      status: existingPart.status,
      createdAt: existingPart.createdAt,
      updatedAt: new Date()
    };

    this.mockParts[partIndex] = updatedPart;
    return { ...updatedPart };
  }

  async deletePart(id: string): Promise<void> {
    await this.simulateNetworkDelay();
    
    const partIndex = this.mockParts.findIndex(p => p.id === id);
    if (partIndex === -1) {
      throw new Error(`Part with id ${id} not found`);
    }

    this.mockParts.splice(partIndex, 1);
  }

  /**
   * Helper method to add more mock data
   */
  addMockPart(part: PartDTO): void {
    this.mockParts.push(part);
  }

  /**
   * Helper method to reset mock data
   */
  resetMockData(): void {
    this.mockParts = [];
  }

  /**
   * Get all mock parts (for testing)
   */
  getAllMockParts(): PartDTO[] {
    return [...this.mockParts];
  }

  private async simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, this.networkDelay));
  }
}
