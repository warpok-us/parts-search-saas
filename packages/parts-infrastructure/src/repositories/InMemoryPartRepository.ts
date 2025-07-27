import { Result } from '../../../shared-kernel/src';
import { 
  Part, 
  PartRepository, 
  PartId, 
  PartNumber, 
  SearchCriteria,
  PartName,
  Price,
  Quantity,
  PartStatus,
  Category
} from '../../../parts-domain/src';

// In-memory implementation for development/testing
export class InMemoryPartRepository implements PartRepository {
  private parts: Map<string, Part> = new Map();

  async save(part: Part): Promise<Result<void>> {
    try {
      this.parts.set(part.getId().getValue(), part);
      return Result.ok();
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to save part');
    }
  }

  async findById(id: PartId): Promise<Result<Part | null>> {
    try {
      const part = this.parts.get(id.getValue()) || null;
      return Result.ok(part);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to find part');
    }
  }

  async findByPartNumber(partNumber: PartNumber): Promise<Result<Part | null>> {
    try {
      const part = Array.from(this.parts.values())
        .find(p => p.getPartNumber().getValue() === partNumber.getValue()) || null;
      return Result.ok(part);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to find part');
    }
  }

  async search(criteria: SearchCriteria): Promise<Result<Part[]>> {
    try {
      let parts = Array.from(this.parts.values());

      if (criteria.name) {
        parts = parts.filter(p => 
          p.getName().getValue().toLowerCase().includes(criteria.name!.toLowerCase())
        );
      }

      if (criteria.partNumber) {
        parts = parts.filter(p => 
          p.getPartNumber().getValue().toLowerCase().includes(criteria.partNumber!.toLowerCase())
        );
      }

      if (criteria.category) {
        parts = parts.filter(p => 
          p.getCategory().getValue().toLowerCase().includes(criteria.category!.toLowerCase())
        );
      }

      if (criteria.status) {
        parts = parts.filter(p => p.getStatus() === criteria.status);
      }

      if (criteria.minPrice !== undefined) {
        parts = parts.filter(p => p.getPrice().getValue() >= criteria.minPrice!);
      }

      if (criteria.maxPrice !== undefined) {
        parts = parts.filter(p => p.getPrice().getValue() <= criteria.maxPrice!);
      }

      if (criteria.inStock) {
        parts = parts.filter(p => p.isInStock());
      }

      // Apply pagination
      const page = criteria.page || 1;
      const limit = criteria.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      const paginatedParts = parts.slice(startIndex, endIndex);

      return Result.ok(paginatedParts);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to search parts');
    }
  }

  async delete(id: PartId): Promise<Result<void>> {
    try {
      this.parts.delete(id.getValue());
      return Result.ok();
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to delete part');
    }
  }

  async exists(partNumber: PartNumber): Promise<Result<boolean>> {
    try {
      const exists = Array.from(this.parts.values())
        .some(p => p.getPartNumber().getValue() === partNumber.getValue());
      return Result.ok(exists);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Failed to check existence');
    }
  }

  // Helper method to seed initial data
  async seedWithInitialData(): Promise<void> {
    const sampleParts = [
      {
        partNumber: 'ENG-001',
        name: 'V8 Engine Block',
        description: 'High-performance V8 engine block for sports cars',
        price: 2500.00,
        quantity: 5,
        category: 'Engine'
      },
      {
        partNumber: 'BRK-002',
        name: 'Brake Disc Set',
        description: 'Premium brake disc set for front wheels',
        price: 150.00,
        quantity: 20,
        category: 'Brakes'
      },
      {
        partNumber: 'TIR-003',
        name: 'All-Season Tire',
        description: 'Durable all-season tire 225/60R16',
        price: 89.99,
        quantity: 100,
        category: 'Tires'
      },
      {
        partNumber: 'FIL-004',
        name: 'Air Filter',
        description: 'High-efficiency air filter for improved performance',
        price: 25.50,
        quantity: 50,
        category: 'Filters'
      },
      {
        partNumber: 'BAT-005',
        name: 'Car Battery 12V',
        description: 'Long-lasting 12V car battery with 3-year warranty',
        price: 120.00,
        quantity: 15,
        category: 'Electrical'
      }
    ];

    for (const partData of sampleParts) {
      const part = Part.create({
        partNumber: new PartNumber(partData.partNumber),
        name: new PartName(partData.name),
        description: partData.description,
        price: new Price(partData.price),
        quantity: new Quantity(partData.quantity),
        status: PartStatus.ACTIVE,
        category: new Category(partData.category)
      });

      await this.save(part);
    }
  }
}
