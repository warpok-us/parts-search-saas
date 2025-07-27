# Real API Integration Guide

This guide explains how to integrate the Partsy SDK with a real backend API, moving beyond the current mock data implementation.

## Current Architecture

The SDK is already designed for real API integration with:

- ✅ HTTP client with proper error handling
- ✅ TypeScript interfaces for all data transfer objects (DTOs)
- ✅ Authentication support (Bearer tokens)
- ✅ Retry logic with exponential backoff
- ✅ Environment configuration
- ✅ React hooks that work with real API clients

## Quick Setup for Real API

### 1. Environment Configuration

Create or update your `.env.local` file:

```bash
# Set to 'false' to use real API instead of mock data
NEXT_PUBLIC_USE_MOCK_DATA=false

# API Configuration
NEXT_PUBLIC_API_ENVIRONMENT=development
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/v1
NEXT_PUBLIC_API_TIMEOUT=10000

# Optional: API Key for authenticated requests
PARTSY_API_KEY=your-secret-api-key
```

### 2. Update Your Application

```typescript
// lib/api-client.ts
import { PartsAPIClientFactory } from '@partsy/sdk';

const client = PartsAPIClientFactory.create({
  environment: process.env.NEXT_PUBLIC_API_ENVIRONMENT,
  customBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  apiKey: process.env.PARTSY_API_KEY,
  timeout: 10000,
  retryAttempts: 3
});

// Use the client in your components
const { results, loading, error, search } = usePartsSearch({ client });
```

## Backend API Requirements

Your backend API should implement these endpoints:

### Base URL Structure
```
{baseUrl}/parts/search    # GET - Search parts
{baseUrl}/parts          # POST - Create part
{baseUrl}/parts/{id}     # GET - Get part by ID
{baseUrl}/parts/{id}     # PUT - Update part
{baseUrl}/parts/{id}     # DELETE - Delete part
```

### 1. Search Parts Endpoint

**Endpoint:** `GET /parts/search`

**Query Parameters:**
- `name` (string, optional): Filter by part name
- `partNumber` (string, optional): Filter by part number
- `category` (string, optional): Filter by category
- `status` (string, optional): Filter by status (ACTIVE, INACTIVE, LOW_STOCK, OUT_OF_STOCK)
- `minPrice` (number, optional): Minimum price filter
- `maxPrice` (number, optional): Maximum price filter
- `inStock` (boolean, optional): Filter for parts in stock
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response Format:**
```json
{
  "parts": [
    {
      "id": "string",
      "partNumber": "string",
      "name": "string",
      "description": "string",
      "price": 0,
      "quantity": 0,
      "status": "ACTIVE|INACTIVE|LOW_STOCK|OUT_OF_STOCK",
      "category": "string",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 0,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

### 2. Get Part by ID

**Endpoint:** `GET /parts/{id}`

**Response:** Single part object (same structure as above)

### 3. Create Part

**Endpoint:** `POST /parts`

**Request Body:**
```json
{
  "partNumber": "string",
  "name": "string",
  "description": "string",
  "price": 0,
  "quantity": 0,
  "category": "string"
}
```

**Response:** Created part object

### 4. Update Part

**Endpoint:** `PUT /parts/{id}`

**Request Body:** Same as create (partial updates supported)

**Response:** Updated part object

### 5. Delete Part

**Endpoint:** `DELETE /parts/{id}`

**Response:** 204 No Content

## Authentication

The SDK supports Bearer token authentication. Include the API key in your environment:

```bash
PARTSY_API_KEY=your-secret-api-key
```

The client will automatically include this in the Authorization header:
```
Authorization: Bearer your-secret-api-key
```

## Error Handling

The SDK provides comprehensive error handling:

### Error Types

1. **APIError**: HTTP errors from the server
   - Includes status code, status text, and response
   - Non-retryable for 4xx client errors
   - Retryable for 5xx server errors

2. **NetworkError**: Network connectivity issues
   - Automatically retried with exponential backoff
   - Provides user-friendly error messages

3. **ValidationError**: Request validation failures
   - Field-specific error information

### Error Handling in Components

```typescript
const { results, loading, error } = usePartsSearch({ client });

if (error) {
  return (
    <div className="error-message">
      <h3>Search Failed</h3>
      <p>{error}</p>
    </div>
  );
}
```

## Advanced Configuration

### Custom Client Configuration

```typescript
import { PartsAPIClient, getAPIConfig } from '@partsy/sdk';

const customClient = new PartsAPIClient({
  baseUrl: 'https://custom-api.com/v1',
  apiKey: 'custom-key',
  timeout: 15000,
  retryAttempts: 5,
  retryDelay: 2000
});
```

### Environment-Specific Configuration

```typescript
import { API_ENVIRONMENTS, getAPIConfig } from '@partsy/sdk';

// Built-in environments: 'development', 'staging', 'production'
const config = getAPIConfig('production');
const client = new PartsAPIClient(config);
```

### Custom Environments

```typescript
import { API_ENVIRONMENTS } from '@partsy/sdk';

// Add custom environment
API_ENVIRONMENTS.testing = {
  name: 'Testing',
  baseUrl: 'https://test-api.partsy.com/v1',
  timeout: 30000,
  retryAttempts: 1
};
```

## Migration from Mock Data

### 1. Update Environment Variables

Change `NEXT_PUBLIC_USE_MOCK_DATA` from `true` to `false`:

```bash
# Before
NEXT_PUBLIC_USE_MOCK_DATA=true

# After
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/v1
```

### 2. Test with Real API

The existing demo application will automatically switch to the real API when mock data is disabled. Test thoroughly:

1. Search functionality
2. Filtering and pagination
3. Error handling
4. Loading states

### 3. Handle Real-World Scenarios

```typescript
// Handle different response structures
const handleSearchResults = (results) => {
  if (!results.parts || results.parts.length === 0) {
    setMessage('No parts found matching your criteria');
    return;
  }
  
  // Process successful results
  setSearchResults(results);
};

// Handle API errors gracefully
const handleSearchError = (error) => {
  if (error instanceof APIError && error.status === 404) {
    setMessage('Parts service temporarily unavailable');
  } else if (error instanceof NetworkError) {
    setMessage('Please check your internet connection');
  } else {
    setMessage('Search failed. Please try again.');
  }
};
```

## Testing Strategy

### 1. Unit Tests

Test API client methods with mocked fetch:

```typescript
import { vi } from 'vitest';
import { PartsAPIClient } from '@partsy/sdk';

const mockFetch = vi.fn();
global.fetch = mockFetch;

test('searchParts should make correct API call', async () => {
  const client = new PartsAPIClient({
    baseUrl: 'https://api.test.com',
    apiKey: 'test-key'
  });

  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ parts: [], total: 0 })
  });

  await client.searchParts({ name: 'engine' });

  expect(mockFetch).toHaveBeenCalledWith(
    'https://api.test.com/parts/search?name=engine',
    expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        'Authorization': 'Bearer test-key'
      })
    })
  );
});
```

### 2. Integration Tests

Test with actual API endpoints:

```typescript
// Use test environment
const client = PartsAPIClientFactory.create({
  environment: 'testing',
  apiKey: process.env.TEST_API_KEY
});

test('real API search integration', async () => {
  const results = await client.searchParts({ limit: 5 });
  expect(results.parts).toBeDefined();
  expect(results.total).toBeGreaterThanOrEqual(0);
});
```

## Production Deployment

### 1. Environment Configuration

```bash
# Production environment variables
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_ENVIRONMENT=production
NEXT_PUBLIC_API_BASE_URL=https://api.partsy.com/v1
NEXT_PUBLIC_API_TIMEOUT=5000
PARTSY_API_KEY=your-production-api-key
```

### 2. Performance Considerations

- Enable API response caching
- Implement request deduplication
- Add monitoring and logging
- Set appropriate timeout values

### 3. Security Best Practices

- Never expose API keys in client-side code
- Use HTTPS for all API communications
- Implement proper CORS policies
- Add rate limiting on the backend

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your API server includes proper CORS headers
2. **Authentication Failures**: Verify API key is correctly set and valid
3. **Timeout Errors**: Adjust timeout values for slower networks
4. **Rate Limiting**: Implement proper retry logic with backoff

### Debug Mode

Enable detailed logging:

```typescript
// In development
console.log('API Client Config:', client.config);
console.log('Search Criteria:', searchCriteria);
```

This comprehensive integration approach ensures a smooth transition from mock data to real API while maintaining all the benefits of the existing architecture.
