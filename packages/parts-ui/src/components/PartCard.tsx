import React from 'react';

// Local type definitions to avoid circular dependencies
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

export interface PartCardRenderProps {
  part: PartDTO;
  isSelected: boolean;
  onSelect: () => void;
  getStatusColor: () => string;
  getStatusText: () => string;
  formatPrice: () => string;
}

export interface PartCardProps {
  part: PartDTO;
  isSelected?: boolean;
  onSelect?: (part: PartDTO) => void;
  children: (props: PartCardRenderProps) => React.ReactNode;
}

export function PartCard({ 
  part, 
  isSelected = false, 
  onSelect,
  children 
}: PartCardProps): React.ReactElement {
  const handleSelect = React.useCallback(() => {
    onSelect?.(part);
  }, [onSelect, part]);

  const getStatusColor = React.useCallback(() => {
    switch (part.status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-800';
      case 'OUT_OF_STOCK':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, [part.status]);

  const getStatusText = React.useCallback(() => {
    return part.status.replace('_', ' ');
  }, [part.status]);

  const formatPrice = React.useCallback(() => {
    return `$${part.price.toFixed(2)}`;
  }, [part.price]);

  return (
    <>
      {children({
        part,
        isSelected,
        onSelect: handleSelect,
        getStatusColor,
        getStatusText,
        formatPrice
      })}
    </>
  );
}
