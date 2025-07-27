'use client';

import React, { useCallback } from 'react';

// Import from public SDK (this would be: import { PartDTO, SearchPartsDTO, etc. } from '@partsy/sdk';)
interface PartDTO {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SearchPartsDTO {
  name?: string;
  partNumber?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  page?: number;
  limit?: number;
}

interface SearchPartsResponseDTO {
  parts: PartDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Mock data for demo
const mockParts: PartDTO[] = [
  {
    id: '1',
    partNumber: 'ENG-001',
    name: 'V8 Engine Block',
    description: 'High-performance V8 engine block for sports cars',
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
    name: 'Brake Disc Set',
    description: 'Premium brake disc set for front wheels',
    price: 150.00,
    quantity: 20,
    status: 'ACTIVE',
    category: 'Brakes',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    partNumber: 'TIR-003',
    name: 'All-Season Tire',
    description: 'Durable all-season tire 225/60R16',
    price: 89.99,
    quantity: 100,
    status: 'ACTIVE',
    category: 'Tires',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    partNumber: 'FIL-004',
    name: 'Air Filter',
    description: 'High-efficiency air filter for improved performance',
    price: 25.50,
    quantity: 50,
    status: 'ACTIVE',
    category: 'Filters',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    partNumber: 'BAT-005',
    name: 'Car Battery 12V',
    description: 'Long-lasting 12V car battery with 3-year warranty',
    price: 120.00,
    quantity: 15,
    status: 'ACTIVE',
    category: 'Electrical',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    partNumber: 'OIL-006',
    name: 'Synthetic Motor Oil',
    description: '5W-30 full synthetic motor oil, 5-quart bottle',
    price: 35.99,
    quantity: 75,
    status: 'ACTIVE',
    category: 'Fluids',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '7',
    partNumber: 'SPK-007',
    name: 'Spark Plug Set',
    description: 'Platinum spark plugs for improved ignition (set of 8)',
    price: 64.99,
    quantity: 30,
    status: 'ACTIVE',
    category: 'Ignition',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '8',
    partNumber: 'LED-008',
    name: 'LED Headlight Kit',
    description: 'High-brightness LED headlight conversion kit',
    price: 199.99,
    quantity: 12,
    status: 'ACTIVE',
    category: 'Lighting',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '9',
    partNumber: 'SUS-009',
    name: 'Shock Absorber Set',
    description: 'Performance shock absorbers for improved handling',
    price: 320.00,
    quantity: 8,
    status: 'ACTIVE',
    category: 'Suspension',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '10',
    partNumber: 'EXH-010',
    name: 'Performance Exhaust',
    description: 'Stainless steel performance exhaust system',
    price: 899.99,
    quantity: 3,
    status: 'LOW_STOCK',
    category: 'Exhaust',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '11',
    partNumber: 'INT-011',
    name: 'Cold Air Intake',
    description: 'High-flow cold air intake system for increased power',
    price: 245.50,
    quantity: 0,
    status: 'OUT_OF_STOCK',
    category: 'Intake',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '12',
    partNumber: 'BRK-012',
    name: 'Brake Pad Set',
    description: 'Ceramic brake pads for quiet, clean stopping',
    price: 89.99,
    quantity: 45,
    status: 'ACTIVE',
    category: 'Brakes',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Simple mock API
const mockSearch = async (criteria: SearchPartsDTO): Promise<SearchPartsResponseDTO> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredParts = [...mockParts];

  if (criteria.name) {
    filteredParts = filteredParts.filter(p => 
      p.name.toLowerCase().includes(criteria.name!.toLowerCase())
    );
  }

  if (criteria.partNumber) {
    filteredParts = filteredParts.filter(p => 
      p.partNumber.toLowerCase().includes(criteria.partNumber!.toLowerCase())
    );
  }

  if (criteria.category) {
    filteredParts = filteredParts.filter(p => 
      p.category.toLowerCase().includes(criteria.category!.toLowerCase())
    );
  }

  if (criteria.minPrice !== undefined) {
    filteredParts = filteredParts.filter(p => p.price >= criteria.minPrice!);
  }

  if (criteria.maxPrice !== undefined) {
    filteredParts = filteredParts.filter(p => p.price <= criteria.maxPrice!);
  }

  if (criteria.inStock) {
    filteredParts = filteredParts.filter(p => p.quantity > 0);
  }

  return {
    parts: filteredParts,
    total: filteredParts.length,
    page: criteria.page || 1,
    limit: criteria.limit || 10,
    totalPages: Math.ceil(filteredParts.length / (criteria.limit || 10))
  };
};

export default function PartsDemo() {
  const [searchCriteria, setSearchCriteria] = React.useState<SearchPartsDTO>({
    name: '',
    partNumber: '',
    category: '',
    page: 1,
    limit: 10
  });
  
  const [searchResults, setSearchResults] = React.useState<SearchPartsResponseDTO | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedPart, setSelectedPart] = React.useState<PartDTO | null>(null);

  // Calculate statistics from mock data
  const stats = React.useMemo(() => {
    const totalParts = mockParts.length;
    const categoriesCount = new Set(mockParts.map(p => p.category)).size;
    const inStockParts = mockParts.filter(p => p.quantity > 0).length;
    const averagePrice = mockParts.reduce((sum, p) => sum + p.price, 0) / totalParts;
    
    return {
      totalParts,
      categoriesCount,
      inStockParts,
      averagePrice: averagePrice.toFixed(2)
    };
  }, []);

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await mockSearch(searchCriteria);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, [searchCriteria]);

  const handleInputChange = (field: keyof SearchPartsDTO, value: string | number | boolean | undefined) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFilterRemove = (field: keyof SearchPartsDTO, value: string | number | boolean | undefined) => {
    handleInputChange(field, value);
    // Trigger search after a short delay to allow state to update
    setTimeout(() => handleSearch(), 100);
  };

  const handlePartSelect = (part: PartDTO) => {
    setSelectedPart(part);
  };

  const clearSelection = () => {
    setSelectedPart(null);
  };

  // Quick search suggestions
  const quickSearches = [
    { label: 'Engine Parts', criteria: { category: 'Engine' } },
    { label: 'Brake Components', criteria: { category: 'Brakes' } },
    { label: 'Under $100', criteria: { maxPrice: 100 } },
    { label: 'High-value Items', criteria: { minPrice: 500 } },
    { label: 'In Stock Only', criteria: { inStock: true } }
  ];

  // Check if a quick search filter is currently active
  const isQuickSearchActive = (criteria: { category?: string; maxPrice?: number; minPrice?: number; inStock?: boolean }) => {
    if (criteria.category) {
      return searchCriteria.category === criteria.category;
    }
    if (criteria.maxPrice) {
      return searchCriteria.maxPrice === criteria.maxPrice;
    }
    if (criteria.minPrice) {
      return searchCriteria.minPrice === criteria.minPrice;
    }
    if (criteria.inStock) {
      return searchCriteria.inStock === criteria.inStock;
    }
    return false;
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return !!(searchCriteria.name || 
             searchCriteria.partNumber || 
             searchCriteria.category || 
             searchCriteria.minPrice || 
             searchCriteria.maxPrice || 
             searchCriteria.inStock);
  };

  // Load initial data on mount
  React.useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Parts Search SaaS</h1>
          <p className="text-xl text-gray-600 mb-6">Domain-Driven Design Demo</p>
          
          {/* Statistics Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-blue-600">{stats.totalParts}</div>
              <div className="text-sm text-gray-600">Total Parts</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-green-600">{stats.categoriesCount}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-orange-600">{stats.inStockParts}</div>
              <div className="text-sm text-gray-600">In Stock</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="text-2xl font-bold text-purple-600">${stats.averagePrice}</div>
              <div className="text-sm text-gray-600">Avg. Price</div>
            </div>
          </div>

          {/* Quick Search Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {quickSearches.map((quick, index) => {
              const isActive = isQuickSearchActive(quick.criteria);
              return (
                <button
                  key={index}
                  onClick={() => {
                    setSearchCriteria(prev => ({ ...prev, ...quick.criteria, page: 1 }));
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                  }`}
                >
                  {quick.label} {isActive && '✓'}
                </button>
              );
            })}
            <button
              onClick={() => {
                setSearchCriteria({
                  name: '',
                  partNumber: '',
                  category: '',
                  page: 1,
                  limit: 10
                });
                setTimeout(() => handleSearch(), 100);
              }}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                hasActiveFilters() 
                  ? 'bg-red-100 hover:bg-red-200 text-red-800' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              Clear All {hasActiveFilters() && '🗑️'}
            </button>
          </div>
        </div>
        
        {/* Search Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Search Parts</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Name</label>
              <input
                type="text"
                placeholder="Enter part name..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchCriteria.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
              <input
                type="text"
                placeholder="Enter part number..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchCriteria.partNumber || ''}
                onChange={(e) => handleInputChange('partNumber', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                placeholder="Enter category..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchCriteria.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchCriteria.minPrice || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('minPrice', value ? parseFloat(value) : undefined);
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="999.99"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={searchCriteria.maxPrice || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleInputChange('maxPrice', value ? parseFloat(value) : undefined);
                }}
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={searchCriteria.inStock || false}
                  onChange={(e) => handleInputChange('inStock', e.target.checked)}
                />
                <span className="text-sm font-medium text-gray-700">In stock only</span>
              </label>
            </div>
          </div>
          
          <button 
            onClick={handleSearch} 
            disabled={loading}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-6 rounded-md transition-colors"
          >
            {loading ? 'Searching...' : 'Search Parts'}
          </button>
        </div>

        {/* Active Filters */}
        {hasActiveFilters() && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {searchCriteria.name && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Name: &quot;{searchCriteria.name}&quot;
                  <button 
                    onClick={() => handleFilterRemove('name', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchCriteria.partNumber && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Part #: &quot;{searchCriteria.partNumber}&quot;
                  <button 
                    onClick={() => handleFilterRemove('partNumber', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchCriteria.category && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Category: &quot;{searchCriteria.category}&quot;
                  <button 
                    onClick={() => handleFilterRemove('category', '')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchCriteria.minPrice && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Min Price: ${searchCriteria.minPrice}
                  <button 
                    onClick={() => handleFilterRemove('minPrice', undefined)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchCriteria.maxPrice && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Max Price: ${searchCriteria.maxPrice}
                  <button 
                    onClick={() => handleFilterRemove('maxPrice', undefined)}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchCriteria.inStock && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  In Stock Only
                  <button 
                    onClick={() => handleFilterRemove('inStock', false)}
                    className="ml-1 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Results List */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-semibold text-gray-800">Search Results</h3>
                  <p className="text-gray-600">
                    Found {searchResults.total} parts 
                    {searchResults.totalPages > 1 && (
                      <span> (Page {searchResults.page} of {searchResults.totalPages})</span>
                    )}
                  </p>
                </div>
                
                {searchResults.parts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No parts found matching your criteria.</p>
                    <p className="text-gray-400 mt-2">Try adjusting your search filters or clearing them completely.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchResults.parts.map((part) => (
                      <div 
                        key={part.id} 
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedPart?.id === part.id 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:shadow-md'
                        }`}
                        onClick={() => handlePartSelect(part)}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-lg font-semibold text-gray-900">{part.name}</h4>
                          <span className="text-sm font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {part.partNumber}
                          </span>
                        </div>
                        
                        {part.description && (
                          <p className="text-gray-600 mb-4">{part.description}</p>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Price:</span>
                            <span className="text-lg font-bold text-green-600">${part.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Quantity:</span>
                            <span className={part.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                              {part.quantity}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Category:</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {part.category}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-700">Status:</span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              part.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              part.status === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {part.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Part Details Panel */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-lg rounded-lg p-6 sticky top-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {selectedPart ? 'Part Details' : 'Component Showcase'}
                </h3>
                
                {selectedPart ? (
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h4 className="text-lg font-semibold text-gray-900">{selectedPart.name}</h4>
                      <p className="text-sm text-gray-600">{selectedPart.partNumber}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Description:</span>
                        <p className="text-gray-600 mt-1">{selectedPart.description || 'No description available'}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <span className="text-sm font-medium text-gray-700">Price:</span>
                          <p className="text-2xl font-bold text-green-600">${selectedPart.price.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Stock:</span>
                          <p className={`text-xl font-semibold ${
                            selectedPart.quantity > 10 ? 'text-green-600' :
                            selectedPart.quantity > 0 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {selectedPart.quantity}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Category:</span>
                        <p className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded mt-1">
                          {selectedPart.category}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-gray-700">Status:</span>
                        <p className={`inline-block px-3 py-1 rounded mt-1 ${
                          selectedPart.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          selectedPart.status === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedPart.status.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <button 
                        className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                          selectedPart.quantity > 0 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={selectedPart.quantity === 0}
                      >
                        {selectedPart.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                      <button 
                        onClick={clearSelection}
                        className="w-full py-2 px-4 border border-gray-300 rounded font-medium hover:bg-gray-50 transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🔍</div>
                      <p className="text-gray-500">Click on any part to see detailed information here</p>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Interactive part selection</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        <span>Real-time inventory status</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-purple-500 mr-2">•</span>
                        <span>Component state management</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        <span>Type-safe data flow</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
