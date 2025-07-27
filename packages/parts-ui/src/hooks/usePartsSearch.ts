import { useState, useCallback } from 'react';
import type { SearchPartsDTO, SearchPartsResponseDTO, PartsAPIClient } from '@partsy/sdk';

export interface UsePartsSearchProps {
  client: PartsAPIClient;
  initialCriteria?: SearchPartsDTO;
}

export interface UsePartsSearchReturn {
  results: SearchPartsResponseDTO | null;
  loading: boolean;
  error: string | null;
  searchCriteria: SearchPartsDTO;
  updateCriteria: (criteria: Partial<SearchPartsDTO>) => void;
  search: () => Promise<void>;
  clearResults: () => void;
}

export function usePartsSearch({ 
  client, 
  initialCriteria = {} 
}: UsePartsSearchProps): UsePartsSearchReturn {
  const [results, setResults] = useState<SearchPartsResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchCriteria, setSearchCriteria] = useState<SearchPartsDTO>(initialCriteria);

  const updateCriteria = useCallback((criteria: Partial<SearchPartsDTO>) => {
    setSearchCriteria(prev => ({ ...prev, ...criteria }));
  }, []);

  const search = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const searchResults = await client.searchParts(searchCriteria);
      setResults(searchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [client, searchCriteria]);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchCriteria,
    updateCriteria,
    search,
    clearResults
  };
}
