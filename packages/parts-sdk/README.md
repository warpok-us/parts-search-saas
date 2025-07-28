# @partsy/sdk

TypeScript API client for parts search with SOLID architecture, dependency injection, and strategy patterns.

## 🚀 Quick Start

```bash
pnpm add @partsy/sdk
```

```typescript
import { PartsAPIClientFactory } from '@partsy/sdk';

const client = PartsAPIClientFactory.create({
  environment: 'development',
  apiKey: 'your-api-key'
});

const parts = await client.searchParts({ query: 'resistor' });
```

## 📋 API Reference

### Basic Usage

```typescript
// Simple client creation
const client = PartsAPIClientFactory.create({
  environment: 'development' | 'staging' | 'production',
  apiKey: 'your-api-key',
  timeout: 5000,
  retryAttempts: 3
});

// Mock client for testing
const mockClient = PartsAPIClientFactory.createWithMockData();
```

### Search Operations

```typescript
// Search parts
const results = await client.searchParts({
  query: 'resistor',
  category: 'electronics',
  inStock: true,
  minPrice: 0.10,
  maxPrice: 10.00
});

// Get specific part
const part = await client.getPartById('part-123');
```

### Write Operations

```typescript
// Create new part
const newPart = await client.createPart({
  partNumber: 'RES-001',
  name: '10K Resistor',
  description: '1/4W 5% tolerance',
  price: 0.15,
  quantity: 1000,
  category: 'resistors'
});

// Update existing part
const updatedPart = await client.updatePart('part-123', {
  price: 0.12,
  quantity: 1500
});

// Delete part
await client.deletePart('part-123');
```

## 🏗️ Advanced Configuration

### Builder Pattern

```typescript
import { PartsAPIClientBuilder } from '@partsy/sdk';

const client = new PartsAPIClientBuilder()
  .setBaseUrl('https://api.example.com')
  .withBearerToken('your-token')
  .withExponentialBackoffRetry(3, 1000, 10000)
  .withDateTransformation()
  .build();
```

### Dependency Injection (Testing)

```typescript
import { PartsAPIClient, MockHttpClient, NoRetryStrategy } from '@partsy/sdk';

const testClient = new PartsAPIClient({
  baseUrl: 'test://api',
  httpClient: new MockHttpClient(),
  retryStrategy: new NoRetryStrategy(),
  authStrategy: new NoAuthStrategy()
});
```

## 🔧 Configuration

### Environment Variables

```bash
# API Configuration
NEXT_PUBLIC_API_ENVIRONMENT=development
NEXT_PUBLIC_API_BASE_URL=https://api.partsy.com/v1
PARTSY_API_KEY=your-secret-api-key
NEXT_PUBLIC_API_TIMEOUT=5000

# Mock Data (for development)
NEXT_PUBLIC_USE_MOCK_DATA=true
```

### Client Options

```typescript
interface ClientConfig {
  environment?: 'development' | 'staging' | 'production';
  apiKey?: string;
  customBaseUrl?: string;
  timeout?: number;
  retryAttempts?: number;
}
```

## 📊 Data Types

### Core Types

```typescript
interface PartDTO {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED';
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SearchPartsDTO {
  query?: string;
  category?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}

interface SearchPartsResponseDTO {
  parts: PartDTO[];
  total: number;
  limit: number;
  offset: number;
}
```

## 🧪 Testing

```typescript
import { PartsAPIClientFactory } from '@partsy/sdk';

describe('Parts API', () => {
  it('should search parts', async () => {
    const client = PartsAPIClientFactory.createWithMockData();
    
    const results = await client.searchParts({ query: 'test' });
    
    expect(results.parts).toHaveLength(3);
    expect(results.total).toBe(3);
  });
});
```

## 🔗 Integration

### React Hooks

Use with `@partsy/ui` for React integration:

```typescript
import { usePartsSearch } from '@partsy/ui';

const { results, loading, error, search } = usePartsSearch({ client });
```

### Error Handling

```typescript
import { APIError, NetworkError, ValidationError } from '@partsy/sdk';

try {
  const part = await client.getPartById('invalid-id');
} catch (error) {
  if (error instanceof APIError) {
    console.error('API Error:', error.status, error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network Error:', error.message);
  } else if (error instanceof ValidationError) {
    console.error('Validation Error:', error.field, error.message);
  }
}
```

## 📈 Features

- ✅ **Type Safety** - Full TypeScript support
- ✅ **Error Handling** - Comprehensive error types
- ✅ **Retry Logic** - Exponential backoff with jitter
- ✅ **Authentication** - Bearer token support
- ✅ **Mocking** - Built-in mock client for testing
- ✅ **Environments** - Development, staging, production configs
- ✅ **SOLID Principles** - Clean, extensible architecture
