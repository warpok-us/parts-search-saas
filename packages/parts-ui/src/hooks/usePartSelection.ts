import { useState, useCallback } from 'react';
import type { PartDTO } from '@partsy/sdk';

export interface UsePartSelectionReturn {
  selectedPart: PartDTO | null;
  selectPart: (part: PartDTO) => void;
  clearSelection: () => void;
  isSelected: (partId: string) => boolean;
}

export function usePartSelection(): UsePartSelectionReturn {
  const [selectedPart, setSelectedPart] = useState<PartDTO | null>(null);

  const selectPart = useCallback((part: PartDTO) => {
    setSelectedPart(part);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPart(null);
  }, []);

  const isSelected = useCallback((partId: string) => {
    return selectedPart?.id === partId;
  }, [selectedPart]);

  return {
    selectedPart,
    selectPart,
    clearSelection,
    isSelected
  };
}
