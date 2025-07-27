import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PartCard, type PartDTO } from '../src/components/PartCard.js';
import React from 'react';

const mockPart: PartDTO = {
  id: '1',
  partNumber: 'ENG-001',
  name: 'V8 Engine Block',
  description: 'High-performance V8 engine block',
  price: 2500.00,
  quantity: 5,
  status: 'ACTIVE',
  category: 'Engine',
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('PartCard', () => {
  it('should render part information via render props', () => {
    render(
      <PartCard part={mockPart}>
        {({ part, formatPrice, getStatusText }) => (
          <div data-testid="part-card">
            <h3>{part.name}</h3>
            <span>{part.partNumber}</span>
            <span>{formatPrice()}</span>
            <span>{getStatusText()}</span>
          </div>
        )}
      </PartCard>
    );

    expect(screen.getByTestId('part-card')).toBeInTheDocument();
    expect(screen.getByText('V8 Engine Block')).toBeInTheDocument();
    expect(screen.getByText('ENG-001')).toBeInTheDocument();
    expect(screen.getByText('$2500.00')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('should provide correct status color for different statuses', () => {
    const activePartProps = { part: mockPart };
    const lowStockPart = { ...mockPart, status: 'LOW_STOCK' as const };
    const outOfStockPart = { ...mockPart, status: 'OUT_OF_STOCK' as const };

    render(
      <div>
        <PartCard {...activePartProps}>
          {({ getStatusColor }) => (
            <span data-testid="active-status" className={getStatusColor()}>
              ACTIVE
            </span>
          )}
        </PartCard>
        <PartCard part={lowStockPart}>
          {({ getStatusColor }) => (
            <span data-testid="low-stock-status" className={getStatusColor()}>
              LOW_STOCK
            </span>
          )}
        </PartCard>
        <PartCard part={outOfStockPart}>
          {({ getStatusColor }) => (
            <span data-testid="out-of-stock-status" className={getStatusColor()}>
              OUT_OF_STOCK
            </span>
          )}
        </PartCard>
      </div>
    );

    expect(screen.getByTestId('active-status')).toHaveClass('bg-green-100', 'text-green-800');
    expect(screen.getByTestId('low-stock-status')).toHaveClass('bg-yellow-100', 'text-yellow-800');
    expect(screen.getByTestId('out-of-stock-status')).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should handle part selection', () => {
    let selectedPart: PartDTO | null = null;
    
    render(
      <PartCard 
        part={mockPart} 
        onSelect={(part) => { selectedPart = part; }}
      >
        {({ onSelect }) => (
          <button onClick={onSelect} data-testid="select-button">
            Select Part
          </button>
        )}
      </PartCard>
    );

    screen.getByTestId('select-button').click();
    expect(selectedPart).toEqual(mockPart);
  });
});
