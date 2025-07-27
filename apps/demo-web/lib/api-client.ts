'use client';

import { PartsAPIClientFactory, PartsAPIClient } from '@partsy/sdk';

export interface APIContextType {
  client: PartsAPIClient;
  isUsingMockData: boolean;
}

export function createAPIClient(): APIContextType {
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
