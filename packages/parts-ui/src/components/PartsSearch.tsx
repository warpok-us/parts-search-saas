import React from 'react';

// Types that mirror @partsy/sdk but are defined locally to avoid circular deps during build
export interface PartDTO {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartsSearchRenderProps {
  parts: PartDTO[];
  loading: boolean;
  error: string | null;
  selectedPart: PartDTO | null;
  onPartSelect: (part: PartDTO) => void;
  onPartClear: () => void;
}

export interface PartsSearchProps {
  parts: PartDTO[];
  loading?: boolean;
  error?: string | null;
  onPartSelect?: (part: PartDTO) => void;
  children: (props: PartsSearchRenderProps) => React.ReactNode;
}

export function PartsSearch({ 
  parts, 
  loading = false, 
  error = null, 
  onPartSelect,
  children 
}: PartsSearchProps): React.ReactElement {
  const [selectedPart, setSelectedPart] = React.useState<PartDTO | null>(null);

  const handlePartSelect = React.useCallback((part: PartDTO) => {
    setSelectedPart(part);
    onPartSelect?.(part);
  }, [onPartSelect]);

  const handlePartClear = React.useCallback(() => {
    setSelectedPart(null);
  }, []);

  return (
    <>
      {children({
        parts,
        loading,
        error,
        selectedPart,
        onPartSelect: handlePartSelect,
        onPartClear: handlePartClear
      })}
    </>
  );
}
