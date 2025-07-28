import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PartsSearch, type PartDTO } from '../src/components/PartsSearch.js';
import React from 'react';

const mockParts: PartDTO[] = [
  {
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
  },
  {
    id: '2',
    partNumber: 'BRK-002', 
    name: 'Brake Pad Set',
    description: 'Premium brake pads',
    price: 150.00,
    quantity: 20,
    status: 'ACTIVE',
    category: 'Brakes',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

describe('PartsSearch', () => {
  it('should render parts list via render props', () => {
    render(
      <PartsSearch parts={mockParts}>
        {({ parts, loading, error }) => (
          <div data-testid="parts-container">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            <div data-testid="parts-count">{parts.length} parts</div>
            {parts.map(part => (
              <div key={part.id} data-testid={`part-${part.id}`}>
                {part.name}
              </div>
            ))}
          </div>
        )}
      </PartsSearch>
    );

    expect(screen.getByTestId('parts-container')).toBeInTheDocument();
    expect(screen.getByTestId('parts-count')).toHaveTextContent('2 parts');
    expect(screen.getByTestId('part-1')).toHaveTextContent('V8 Engine Block');
    expect(screen.getByTestId('part-2')).toHaveTextContent('Brake Pad Set');
  });

  it('should handle loading state', () => {
    render(
      <PartsSearch parts={[]} loading={true}>
        {({ loading }) => (
          <div>
            {loading ? (
              <div data-testid="loading">Loading parts...</div>
            ) : (
              <div data-testid="content">Content</div>
            )}
          </div>
        )}
      </PartsSearch>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('content')).not.toBeInTheDocument();
  });

  it('should handle error state', () => {
    render(
      <PartsSearch parts={[]} error="Failed to load parts">
        {({ error }) => (
          <div>
            {error ? (
              <div data-testid="error">Error: {error}</div>
            ) : (
              <div data-testid="success">Success</div>
            )}
          </div>
        )}
      </PartsSearch>
    );

    expect(screen.getByTestId('error')).toHaveTextContent('Error: Failed to load parts');
    expect(screen.queryByTestId('success')).not.toBeInTheDocument();
  });

  it('should handle part selection', () => {
    const mockOnPartSelect = vi.fn();
    
    render(
      <PartsSearch parts={mockParts} onPartSelect={mockOnPartSelect}>
        {({ parts, selectedPart, onPartSelect, onPartClear }) => (
          <div>
            {selectedPart && (
              <div data-testid="selected-part">
                Selected: {selectedPart.name}
                <button onClick={onPartClear} data-testid="clear-button">
                  Clear
                </button>
              </div>
            )}
            {parts.map(part => (
              <button 
                key={part.id}
                onClick={() => onPartSelect(part)}
                data-testid={`select-${part.id}`}
              >
                Select {part.name}
              </button>
            ))}
          </div>
        )}
      </PartsSearch>
    );

    // Initially no part selected
    expect(screen.queryByTestId('selected-part')).not.toBeInTheDocument();

    // Select first part
    fireEvent.click(screen.getByTestId('select-1'));
    
    // Check internal state
    expect(screen.getByTestId('selected-part')).toHaveTextContent('Selected: V8 Engine Block');
    
    // Check callback was called
    expect(mockOnPartSelect).toHaveBeenCalledWith(mockParts[0]);

    // Clear selection
    fireEvent.click(screen.getByTestId('clear-button'));
    expect(screen.queryByTestId('selected-part')).not.toBeInTheDocument();
  });

  it('should manage selected part state independently', () => {
    render(
      <PartsSearch parts={mockParts}>
        {({ parts, selectedPart, onPartSelect }) => (
          <div>
            {selectedPart ? (
              <div data-testid="current-selection">{selectedPart.name}</div>
            ) : (
              <div data-testid="no-selection">No part selected</div>
            )}
            {parts.map(part => (
              <button 
                key={part.id}
                onClick={() => onPartSelect(part)}
                data-testid={`select-${part.id}`}
              >
                {part.name}
              </button>
            ))}
          </div>
        )}
      </PartsSearch>
    );

    expect(screen.getByTestId('no-selection')).toBeInTheDocument();

    // Select first part
    fireEvent.click(screen.getByTestId('select-1'));
    expect(screen.getByTestId('current-selection')).toHaveTextContent('V8 Engine Block');

    // Select second part (should replace first)
    fireEvent.click(screen.getByTestId('select-2'));
    expect(screen.getByTestId('current-selection')).toHaveTextContent('Brake Pad Set');
  });
});
