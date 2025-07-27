import React, { useState, useEffect } from 'react';
import type { PartDTO, SearchPartsDTO, SearchPartsResponseDTO } from '@partsy/parts-sdk';

interface PartSearchProps {
  onSearch: (criteria: SearchPartsDTO) => Promise<SearchPartsResponseDTO>;
  onPartSelect?: (part: PartDTO) => void;
}

export const PartSearch: React.FC<PartSearchProps> = ({ onSearch, onPartSelect }) => {
  const [searchCriteria, setSearchCriteria] = useState<SearchPartsDTO>({
    name: '',
    partNumber: '',
    category: '',
    page: 1,
    limit: 10
  });
  
  const [searchResults, setSearchResults] = useState<SearchPartsResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await onSearch(searchCriteria);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SearchPartsDTO, value: string | number) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="part-search">
      <div className="search-form">
        <div className="form-row">
          <input
            type="text"
            placeholder="Part name..."
            value={searchCriteria.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
          <input
            type="text"
            placeholder="Part number..."
            value={searchCriteria.partNumber || ''}
            onChange={(e) => handleInputChange('partNumber', e.target.value)}
          />
          <input
            type="text"
            placeholder="Category..."
            value={searchCriteria.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
          />
        </div>
        
        <div className="form-row">
          <input
            type="number"
            placeholder="Min price..."
            value={searchCriteria.minPrice || ''}
            onChange={(e) => handleInputChange('minPrice', parseFloat(e.target.value) || undefined)}
          />
          <input
            type="number"
            placeholder="Max price..."
            value={searchCriteria.maxPrice || ''}
            onChange={(e) => handleInputChange('maxPrice', parseFloat(e.target.value) || undefined)}
          />
          <label>
            <input
              type="checkbox"
              checked={searchCriteria.inStock || false}
              onChange={(e) => handleInputChange('inStock', e.target.checked)}
            />
            In stock only
          </label>
        </div>
        
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search Parts'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {searchResults && (
        <div className="search-results">
          <div className="results-header">
            <h3>Search Results</h3>
            <p>
              Found {searchResults.total} parts 
              (Page {searchResults.page} of {searchResults.totalPages})
            </p>
          </div>
          
          <div className="parts-list">
            {searchResults.parts.map((part) => (
              <div 
                key={part.id} 
                className="part-item"
                onClick={() => onPartSelect?.(part)}
              >
                <div className="part-header">
                  <h4>{part.name}</h4>
                  <span className="part-number">{part.partNumber}</span>
                </div>
                <div className="part-details">
                  <p className="description">{part.description}</p>
                  <div className="part-meta">
                    <span className="price">${part.price.toFixed(2)}</span>
                    <span className="quantity">Qty: {part.quantity}</span>
                    <span className="category">{part.category}</span>
                    <span className={`status ${part.status.toLowerCase()}`}>
                      {part.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
