# @partsy/parts-infrastructure

Infrastructure layer providing concrete implementations of domain repository interfaces.

## Purpose

Implements data persistence and external service adapters. Contains concrete implementations of repository interfaces defined in the domain layer.

## Contents

- **Repositories** - Database implementations of domain contracts
- **Elastic** - Elasticsearch adapters for search functionality  
- **Postgres** - PostgreSQL implementations for transactional data
- **External Services** - Third-party API adapters

## Quick Start

```typescript
import { PostgresPartsRepository } from '@partsy/parts-infrastructure';
import { PartsRepository } from '@partsy/parts-domain';

// Use as domain contract
const repository: PartsRepository = new PostgresPartsRepository({
  host: 'localhost',
  port: 5432,
  database: 'parts_db',
  username: 'user',
  password: 'pass'
});

// Repository operations
const part = await repository.findById('part-123');
await repository.save(updatedPart);
```

## Elasticsearch Integration

```typescript
import { ElasticsearchPartsRepository } from '@partsy/parts-infrastructure';

const searchRepository = new ElasticsearchPartsRepository({
  node: 'http://localhost:9200',
  index: 'parts'
});

// Full-text search capabilities
const results = await searchRepository.search({
  query: 'resistor 100 ohm',
  filters: { category: 'electronic-components' }
});
```

## Architecture

Follows Clean Architecture principles:
- **Dependencies**: On `@partsy/parts-domain` for contracts
- **Direction**: Infrastructure → Domain (inward dependency)
- **Responsibility**: Technical implementation details

## Key Patterns

- **Repository Pattern** - Abstract data access
- **Adapter Pattern** - External service integration
- **Strategy Pattern** - Multiple storage implementations

## Dependencies

- `@partsy/parts-domain` - Repository interfaces and entities
- `@partsy/shared-utils` - Common utilities

## Development

```bash
# Install dependencies
pnpm install

# Build
pnpm build

# Run tests (requires test database)
pnpm test

# Type checking
pnpm check-types
```

## Database Setup

For local development, ensure PostgreSQL and Elasticsearch are running:

```bash
# PostgreSQL
docker run -d --name postgres -p 5432:5432 -e POSTGRES_DB=parts_db postgres:15

# Elasticsearch
docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" elasticsearch:8.0.0
```
