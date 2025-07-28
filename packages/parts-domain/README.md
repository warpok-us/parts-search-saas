# @partsy/parts-domain

Core business entities, value objects, and domain logic for the parts search system.

## 🏗️ Overview

This package contains the **pure business logic** of the parts management domain. It has **no external dependencies** and focuses solely on business rules and domain concepts.

## 📦 Installation

```bash
pnpm add @partsy/parts-domain
```

## 🏛️ Domain Model

### Entities

#### Part
Core business entity representing a part in the inventory.

```typescript
import { Part, PartId, Money, PartStatus } from '@partsy/parts-domain';

// Create a new part
const part = Part.create({
  partNumber: 'RES-001',
  name: '10K Resistor',
  description: '1/4W 5% tolerance',
  price: Money.create(0.15, 'USD'),
  category: 'resistors'
});

// Business operations
part.updatePrice(Money.create(0.12, 'USD'));
part.adjustQuantity(100);
part.markAsDiscontinued();

// Domain queries
const isAvailable = part.isAvailable();
const isExpensive = part.isExpensive(Money.create(1.00, 'USD'));
```

#### Category
Hierarchical categorization of parts.

```typescript
import { Category, CategoryId } from '@partsy/parts-domain';

const electronics = Category.create({
  name: 'Electronics',
  description: 'Electronic components'
});

const resistors = Category.create({
  name: 'Resistors',
  description: 'Resistive components',
  parentId: electronics.getId()
});

// Domain operations
const isSubcategory = resistors.isSubcategoryOf(electronics);
const path = resistors.getHierarchyPath(); // ['Electronics', 'Resistors']
```

### Value Objects

#### PartId
Strongly-typed identifier for parts.

```typescript
import { PartId } from '@partsy/parts-domain';

// Type-safe ID creation
const partId = PartId.generate();
const existingId = PartId.fromString('part-123');

// Value object equality
const id1 = PartId.fromString('part-123');
const id2 = PartId.fromString('part-123');
console.log(id1.equals(id2)); // true
```

#### Money
Monetary values with currency awareness.

```typescript
import { Money } from '@partsy/parts-domain';

const price = Money.create(10.50, 'USD');
const tax = Money.create(1.05, 'USD');

// Safe monetary operations
const total = price.add(tax);
const discounted = price.multiply(0.9);

// Comparisons
const isExpensive = price.isGreaterThan(Money.create(5.00, 'USD'));

// Formatting
console.log(price.toString()); // '$10.50'
```

#### PartNumber
Business-specific part numbering rules.

```typescript
import { PartNumber } from '@partsy/parts-domain';

// Validates part number format
const partNumber = PartNumber.create('RES-10K-001');

// Business rules validation
const isValid = PartNumber.isValid('INVALID'); // false
const formatted = partNumber.getFormatted(); // 'RES-10K-001'
```

### Domain Services

#### PartValidator
Encapsulates complex validation rules.

```typescript
import { PartValidator } from '@partsy/parts-domain';

const validator = new PartValidator();

// Validate part data
const result = validator.validate({
  partNumber: 'RES-001',
  name: '10K Resistor',
  price: Money.create(0.15, 'USD'),
  category: 'resistors'
});

if (!result.isValid) {
  console.log('Validation errors:', result.errors);
}
```

#### PricingService
Business rules for pricing calculations.

```typescript
import { PricingService } from '@partsy/parts-domain';

const pricingService = new PricingService();

// Calculate bulk pricing
const bulkPrice = pricingService.calculateBulkPrice(
  Money.create(1.00, 'USD'),
  1000 // quantity
);

// Apply discounts
const discountedPrice = pricingService.applyDiscount(
  Money.create(10.00, 'USD'),
  0.15 // 15% discount
);
```

## 🔧 Repository Interfaces

Defines contracts for data persistence (implemented in infrastructure layer).

```typescript
import { PartRepository, CategoryRepository } from '@partsy/parts-domain';

// Repository contracts
interface PartRepository {
  findById(id: PartId): Promise<Part | null>;
  findByPartNumber(partNumber: PartNumber): Promise<Part | null>;
  findByCategory(categoryId: CategoryId): Promise<Part[]>;
  save(part: Part): Promise<void>;
  delete(id: PartId): Promise<void>;
}

interface CategoryRepository {
  findById(id: CategoryId): Promise<Category | null>;
  findByParent(parentId: CategoryId): Promise<Category[]>;
  findRootCategories(): Promise<Category[]>;
  save(category: Category): Promise<void>;
}
```

## 🎯 Domain Events

Events that occur during business operations.

```typescript
import { PartCreatedEvent, PartDiscontinuedEvent } from '@partsy/parts-domain';

// Domain events are raised automatically
const part = Part.create({ /* ... */ });
// Raises: PartCreatedEvent

part.markAsDiscontinued();
// Raises: PartDiscontinuedEvent

// Access events
const events = part.getDomainEvents();
part.clearDomainEvents();
```

## 📋 Business Rules Examples

### Part Business Rules

```typescript
class Part {
  // Rule: Part number must be unique
  static async create(data: CreatePartData, repository: PartRepository): Promise<Part> {
    const existing = await repository.findByPartNumber(data.partNumber);
    if (existing) {
      throw new DomainError('Part number already exists');
    }
    return new Part(data);
  }

  // Rule: Cannot sell discontinued parts
  adjustQuantity(delta: number): void {
    if (this.status === PartStatus.DISCONTINUED && delta > 0) {
      throw new DomainError('Cannot increase quantity of discontinued part');
    }
    this.quantity += delta;
  }

  // Rule: Price changes must be logged
  updatePrice(newPrice: Money): void {
    if (!newPrice.equals(this.price)) {
      this.addDomainEvent(new PriceChangedEvent(this.id, this.price, newPrice));
      this.price = newPrice;
    }
  }
}
```

### Category Business Rules

```typescript
class Category {
  // Rule: Cannot create circular hierarchies
  setParent(parent: Category): void {
    if (this.wouldCreateCircularReference(parent)) {
      throw new DomainError('Cannot create circular category hierarchy');
    }
    this.parentId = parent.getId();
  }

  // Rule: Cannot delete category with parts
  static async delete(id: CategoryId, partRepository: PartRepository): Promise<void> {
    const parts = await partRepository.findByCategory(id);
    if (parts.length > 0) {
      throw new DomainError('Cannot delete category that contains parts');
    }
  }
}
```

## 🧪 Testing

```typescript
import { Part, Money, PartStatus } from '@partsy/parts-domain';

describe('Part Domain Entity', () => {
  it('should create part with valid data', () => {
    const part = Part.create({
      partNumber: 'TEST-001',
      name: 'Test Part',
      price: Money.create(1.00, 'USD')
    });

    expect(part.getPartNumber().value).toBe('TEST-001');
    expect(part.getName()).toBe('Test Part');
    expect(part.getStatus()).toBe(PartStatus.ACTIVE);
  });

  it('should enforce business rules', () => {
    const part = Part.create({ /* ... */ });
    
    // Rule: Cannot set negative price
    expect(() => {
      part.updatePrice(Money.create(-1.00, 'USD'));
    }).toThrow('Price cannot be negative');
  });

  it('should raise domain events', () => {
    const part = Part.create({ /* ... */ });
    part.markAsDiscontinued();

    const events = part.getDomainEvents();
    expect(events).toHaveLength(2); // PartCreated + PartDiscontinued
  });
});
```

## 📊 Types

```typescript
// Core types
export interface CreatePartData {
  partNumber: string;
  name: string;
  description?: string;
  price: Money;
  category: string;
  initialQuantity?: number;
}

export enum PartStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED'
}

// Value object types
export interface MoneyData {
  amount: number;
  currency: string;
}

// Domain event types
export interface DomainEvent {
  readonly eventId: string;
  readonly occurredAt: Date;
  readonly aggregateId: string;
}
```

## 🔗 Integration

This package is used by:

- **[@partsy/parts-application](../parts-application/)** - For use cases and orchestration
- **[@partsy/parts-infrastructure](../parts-infrastructure/)** - For repository implementations
- **[@partsy/sdk](../parts-sdk/)** - For DTOs and API client

## 📈 Features

- ✅ **Pure Domain Logic** - No external dependencies
- ✅ **Rich Domain Model** - Entities with business behavior
- ✅ **Value Objects** - Type safety and business rules
- ✅ **Domain Events** - Capture business occurrences
- ✅ **Business Rules** - Enforced at the domain level
- ✅ **Repository Contracts** - Clean data access abstraction
- ✅ **Full Type Safety** - Comprehensive TypeScript types
