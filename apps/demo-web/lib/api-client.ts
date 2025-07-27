'use client';

import { PartsAPIClientFactory } from '@partsy/sdk';
import type { PartDTO, CreatePartDTO, SearchPartsDTO, SearchPartsResponseDTO } from '@partsy/sdk';

// Interface for the public API methods that both clients implement
export interface PartsAPIClientInterface {
  createPart(dto: CreatePartDTO): Promise<PartDTO>;
  searchParts(dto: SearchPartsDTO): Promise<SearchPartsResponseDTO>;
  getPartById(id: string): Promise<PartDTO>;
  updatePart(id: string, dto: Partial<CreatePartDTO>): Promise<PartDTO>;
  deletePart(id: string): Promise<void>;
}

export interface APIContextType {
  client: PartsAPIClientInterface;
  isUsingMockData: boolean;
}

export function createAPIClient(): APIContextType | null {
  // Only create the client on the client side to avoid SSR issues
  if (typeof window === 'undefined') {
    return null;
  }
  
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';
  
  if (useMockData) {
    return {
      client: PartsAPIClientFactory.createWithMockData(),
      isUsingMockData: true
    };
  }

  const client = PartsAPIClientFactory.create({
    environment: process.env.NEXT_PUBLIC_API_ENVIRONMENT || 'development',
    customBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    timeout: process.env.NEXT_PUBLIC_API_TIMEOUT ? parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) : undefined,
    apiKey: process.env.PARTSY_API_KEY
  });

  return {
    client,
    isUsingMockData: false
  };
}
