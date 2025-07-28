import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PartsAPIClient, createPartsAPIClient, type PartsAPIConfig } from '../src/index.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('PartsAPIClient', () => {
  let client: PartsAPIClient;
  let config: PartsAPIConfig;

  beforeEach(() => {
    config = {
      baseUrl: 'https://api.example.com',
      apiKey: 'test-api-key',
      timeout: 5000
    };
    client = new PartsAPIClient(config);
    mockFetch.mockClear();
  });

  describe('constructor', () => {
    it('should create client with provided config', () => {
      expect(client).toBeInstanceOf(PartsAPIClient);
    });

    it('should apply default timeout if not provided', () => {
      const clientWithoutTimeout = new PartsAPIClient({
        baseUrl: 'https://api.example.com'
      });
      expect(clientWithoutTimeout).toBeInstanceOf(PartsAPIClient);
    });
  });

  describe('searchParts', () => {
    it('should make GET request with query parameters', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: (name: string) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve({
          parts: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      const searchDto = {
        name: 'engine',
        category: 'automotive',
        page: 1,
        limit: 10
      };

      await client.searchParts(searchDto);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/parts/search?name=engine&category=automotive&page=1&limit=10',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should handle search with no filters', async () => {
      const mockResponse = {
        ok: true,
        headers: {
          get: (name: string) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve({
          parts: [],
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      await client.searchParts({});

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/parts/search',
        expect.any(Object)
      );
    });
  });

  describe('getPartById', () => {
    it('should make GET request to specific part endpoint', async () => {
      const mockPart = {
        id: '1',
        partNumber: 'ENG-001',
        name: 'V8 Engine',
        price: 2500,
        quantity: 5,
        status: 'ACTIVE' as const,
        category: 'Engine',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockResponse = {
        ok: true,
        headers: {
          get: (name: string) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve(mockPart)
      };
      mockFetch.mockResolvedValue(mockResponse);

      const result = await client.getPartById('1');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/parts/1',
        expect.objectContaining({
          method: 'GET'
        })
      );
      expect(result).toMatchObject({
        id: '1',
        partNumber: 'ENG-001',
        name: 'V8 Engine',
        price: 2500,
        quantity: 5,
        status: 'ACTIVE',
        category: 'Engine'
      });
    });
  });

  describe('createPart', () => {
    it('should make POST request with part data', async () => {
      const createDto = {
        partNumber: 'NEW-001',
        name: 'New Part',
        description: 'A new automotive part',
        price: 100,
        quantity: 10,
        category: 'Test'
      };

      const mockResponse = {
        ok: true,
        headers: {
          get: (name: string) => name === 'content-type' ? 'application/json' : null
        },
        json: () => Promise.resolve({
          id: '123',
          ...createDto,
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };
      mockFetch.mockResolvedValue(mockResponse);

      await client.createPart(createDto);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/parts',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(createDto)
        })
      );
    });
  });

  describe('error handling', () => {
    it('should throw error when API request fails', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };
      mockFetch.mockResolvedValue(mockResponse);

      await expect(client.getPartById('nonexistent')).rejects.toThrow(
        'API request failed: 404 Not Found'
      );
    });
  });
});

describe('createPartsAPIClient factory', () => {
  it('should create PartsAPIClient instance', () => {
    const config = { baseUrl: 'https://api.example.com' };
    const client = createPartsAPIClient(config);
    expect(client).toBeInstanceOf(PartsAPIClient);
  });
});
