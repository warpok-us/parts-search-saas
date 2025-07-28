'use client';

import React, { useState, useEffect } from 'react';
import { createAPIClient, APIContextType } from '../../lib/api-client';
import { usePartsSearch } from '@partsy/ui';
import type { PartDTO } from '@partsy/sdk';
import type { PartsAPIClient } from '@partsy/sdk';

export default function DemoPage() {
  const [apiContext, setApiContext] = useState<ReturnType<typeof createAPIClient> | null>(null);

  // Initialize the API client on the client side only
  useEffect(() => {
    const context = createAPIClient();
    setApiContext(context);
  }, []);

  if (!apiContext) {
    return <div>Loading...</div>;
  }

  // Show loading state until API client is ready
  if (!apiContext) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Loading API client...</div>
          </div>
        </div>
      </div>
    );
  }

  return <DemoContent {...apiContext} />;
}

function DemoContent({ client, isUsingMockData }: APIContextType) {
  const {
    results,
    loading,
    error,
    searchCriteria,
    updateCriteria,
    search,
    clearResults
  } = usePartsSearch({
    client: client as PartsAPIClient, // Type assertion - both clients implement the same public interface
    initialCriteria: { limit: 10, page: 1 }
  });

  const [selectedPart, setSelectedPart] = useState<PartDTO | null>(null);

  const handleSearch = async () => {
    await search();
  };

  const handleFilterChange = (field: string, value: string | number | boolean) => {
    updateCriteria({ [field]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Parts Search Demo</h1>
          <p className="mt-2 text-gray-600">
            {isUsingMockData ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                🧪 Using Mock Data
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                🌐 Connected to Real API
              </span>
            )}
          </p>
        </div>

        {/* Search Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Part Name
              </label>
              <input
                type="text"
                value={searchCriteria.name || ''}
                onChange={(e) => handleFilterChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                placeholder="Search by name..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={searchCriteria.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">All Categories</option>
                <option value="Engine">Engine</option>
                <option value="Brakes">Brakes</option>
                <option value="Tires">Tires</option>
                <option value="Filters">Filters</option>
                <option value="Electrical">Electrical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={searchCriteria.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                'Search Parts'
              )}
            </button>
            
            <button
              onClick={clearResults}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Search Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Search Results ({results.total} parts found)
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {results.parts.map((part) => (
                <div
                  key={part.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedPart?.id === part.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPart(part)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{part.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      part.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      part.status === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {part.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{part.partNumber}</p>
                  
                  {part.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                      {part.description}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-gray-900">
                      ${part.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {part.quantity}
                    </span>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-400">
                    Category: {part.category}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {results.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  Page {results.page} of {results.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFilterChange('page', Math.max(1, (searchCriteria.page || 1) - 1))}
                    disabled={loading || (searchCriteria.page || 1) <= 1}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handleFilterChange('page', Math.min(results.totalPages, (searchCriteria.page || 1) + 1))}
                    disabled={loading || (searchCriteria.page || 1) >= results.totalPages}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Selected Part Details */}
        {selectedPart && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Part Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedPart.name}</h3>
                <p className="text-gray-600">Part Number: {selectedPart.partNumber}</p>
                <p className="text-gray-600">Category: {selectedPart.category}</p>
                <p className="text-gray-600">Status: {selectedPart.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Price: ${selectedPart.price.toFixed(2)}</p>
                <p className="text-gray-600">Stock: {selectedPart.quantity} units</p>
                <p className="text-gray-600">
                  Created: {selectedPart.createdAt.toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  Updated: {selectedPart.updatedAt.toLocaleDateString()}
                </p>
              </div>
            </div>
            {selectedPart.description && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedPart.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
