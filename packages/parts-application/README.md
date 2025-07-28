# @partsy/parts-application

Clean architecture application layer implementing use cases and DTOs for parts search operations.

## Purpose

Contains business use cases and data transfer objects that orchestrate domain entities and external services. This layer defines the application's behavior without depending on specific implementations.

## Contents

- **Use Cases** - Application-specific business rules
- **DTOs** - Data transfer objects for API boundaries
- **Application Services** - Coordinate domain and infrastructure

## Quick Start

```typescript
import { SearchPartsUseCase, SearchPartsDTO } from '@partsy/parts-application';
import { PartsRepository } from '@partsy/parts-domain';
import { PostgresPartsRepository } from '@partsy/parts-infrastructure';

// Dependency injection
const repository: PartsRepository = new PostgresPartsRepository();
const searchUseCase = new SearchPartsUseCase(repository);

// Execute use case
const searchParams: SearchPartsDTO = {
  query: 'resistor',
  category: 'electronic-components',
  maxPrice: 10.00
};

const results = await searchUseCase.execute(searchParams);
```

## Architecture

Follows Clean Architecture principles:
- **Dependencies**: Only on `@partsy/parts-domain` and `@partsy/shared-utils`
- **Direction**: Application → Domain (inward dependency)
- **Responsibility**: Orchestrate business operations

## Key Patterns

- **Use Case Pattern** - Single responsibility per business operation
- **DTO Pattern** - Data contracts for external boundaries
- **Dependency Injection** - Abstractions over concrete implementations

## Dependencies

- `@partsy/parts-domain` - Business entities and rules
- `@partsy/shared-utils` - Shared utilities and helpers

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Type checking
pnpm check-types
```
