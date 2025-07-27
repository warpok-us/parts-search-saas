'use client';

import React from 'react';

// For demo purposes, we'll create simple mock implementations
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

  const handleSearch = async () => {
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
  };

  const handleInputChange = (field: keyof SearchPartsDTO, value: string | number | boolean | undefined) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Load initial data on mount
  React.useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Parts Search SaaS</h1>
          <p className="text-xl text-gray-600">Domain-Driven Design Demo</p>
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
              <input
                type="text"
                placeholder="Enter part number..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchCriteria.partNumber || ''}
                onChange={(e) => handleInputChange('partNumber', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <input
                type="text"
                placeholder="Enter category..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
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
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {searchResults.parts.map((part) => (
                  <div key={part.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
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
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {part.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
