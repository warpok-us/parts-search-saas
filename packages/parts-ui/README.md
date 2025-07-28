# @partsy/ui

React components and hooks for building parts search interfaces with headless design patterns.

## 🚀 Quick Start

```bash
pnpm add @partsy/ui @partsy/sdk
```

```tsx
import { usePartsSearch } from '@partsy/ui';
import { PartsAPIClientFactory } from '@partsy/sdk';

function SearchDemo() {
  const client = PartsAPIClientFactory.createWithMockData();
  const { results, loading, search } = usePartsSearch({ client });

  return (
    <div>
      <button onClick={() => search({ query: 'resistor' })}>
        Search Parts
      </button>
      {loading && <p>Loading...</p>}
      {results?.parts.map(part => (
        <div key={part.id}>{part.name} - ${part.price}</div>
      ))}
    </div>
  );
}
```

## 🪝 Hooks

### usePartsSearch

Search for parts with automatic state management.

```tsx
import { usePartsSearch } from '@partsy/ui';

function SearchComponent() {
  const { 
    results, 
    loading, 
    error, 
    search, 
    updateCriteria 
  } = usePartsSearch({ 
    client,
    initialCriteria: { inStock: true }
  });

  return (
    <div>
      <input 
        onChange={(e) => updateCriteria({ query: e.target.value })}
        placeholder="Search parts..."
      />
      <button onClick={search} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      
      {error && <div className="error">{error}</div>}
      
      {results && (
        <div>
          <p>Found {results.total} parts</p>
          {results.parts.map(part => (
            <div key={part.id}>
              <h3>{part.name}</h3>
              <p>{part.partNumber} - ${part.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### usePartSelection

Manage selected parts state.

```tsx
import { usePartSelection } from '@partsy/ui';

function PartsList({ parts }) {
  const { selectedPart, selectPart, clearSelection } = usePartSelection();

  return (
    <div>
      {parts.map(part => (
        <div 
          key={part.id}
          className={selectedPart?.id === part.id ? 'selected' : ''}
          onClick={() => selectPart(part)}
        >
          {part.name}
        </div>
      ))}
      <button onClick={clearSelection}>Clear Selection</button>
    </div>
  );
}
```

### usePartDetails

Fetch and manage individual part details.

```tsx
import { usePartDetails } from '@partsy/ui';

function PartDetailsPage({ partId }) {
  const { part, loading, error, refresh } = usePartDetails({ 
    client, 
    partId 
  });

  if (loading) return <div>Loading part details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!part) return <div>Part not found</div>;

  return (
    <div>
      <h1>{part.name}</h1>
      <p>Part Number: {part.partNumber}</p>
      <p>Price: ${part.price}</p>
      <p>In Stock: {part.quantity}</p>
      <button onClick={refresh}>Refresh</button>
    </div>
  );
}
```

## 🧩 Components

### PartsSearch (Headless)

Render prop component for flexible search interfaces.

```tsx
import { PartsSearch } from '@partsy/ui';

function CustomSearch({ client }) {
  return (
    <PartsSearch client={client}>
      {({ parts, selectedPart, onPartSelect, loading, search }) => (
        <div>
          <input 
            onChange={(e) => search({ query: e.target.value })}
            placeholder="Search..."
          />
          {loading && <div>Loading...</div>}
          <div className="grid">
            {parts.map(part => (
              <div 
                key={part.id}
                className={selectedPart?.id === part.id ? 'selected' : ''}
                onClick={() => onPartSelect(part)}
              >
                {part.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </PartsSearch>
  );
}
```

### PartCard (Headless)

Flexible part card component with render props.

```tsx
import { PartCard } from '@partsy/ui';

function PartsList({ parts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {parts.map(part => (
        <PartCard key={part.id} part={part}>
          {({ part, isSelected, onSelect, getStatusColor, formatPrice }) => (
            <div 
              className={`p-4 border rounded-lg cursor-pointer ${
                isSelected ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={onSelect}
            >
              <h3 className="font-semibold">{part.name}</h3>
              <p className="text-sm text-gray-600">{part.partNumber}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="font-bold">{formatPrice()}</span>
                <span className={`px-2 py-1 rounded text-xs ${getStatusColor()}`}>
                  {part.status}
                </span>
              </div>
            </div>
          )}
        </PartCard>
      ))}
    </div>
  );
}
```

## 🎨 Styling

Components are **headless** - you provide the styling. Works with any CSS framework:

### Tailwind CSS

```tsx
<div className="p-4 border border-gray-200 rounded-lg hover:shadow-md">
  <h3 className="text-lg font-semibold text-gray-900">{part.name}</h3>
  <p className="text-sm text-gray-500">{part.partNumber}</p>
</div>
```

### CSS Modules

```tsx
import styles from './PartCard.module.css';

<div className={styles.card}>
  <h3 className={styles.title}>{part.name}</h3>
  <p className={styles.partNumber}>{part.partNumber}</p>
</div>
```

### Styled Components

```tsx
import styled from 'styled-components';

const Card = styled.div`
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
`;
```

## 📊 Types

```typescript
// Hook Options
interface UsePartsSearchOptions {
  client: PartsAPIClient;
  initialCriteria?: SearchPartsDTO;
  autoSearch?: boolean;
}

// Hook Returns
interface UsePartsSearchReturn {
  results: SearchPartsResponseDTO | null;
  loading: boolean;
  error: string | null;
  search: (criteria?: SearchPartsDTO) => Promise<void>;
  updateCriteria: (criteria: Partial<SearchPartsDTO>) => void;
  reset: () => void;
}

// Component Props
interface PartCardProps {
  part: PartDTO;
  isSelected?: boolean;
  onSelect?: (part: PartDTO) => void;
  children: (props: PartCardRenderProps) => React.ReactNode;
}

interface PartCardRenderProps {
  part: PartDTO;
  isSelected: boolean;
  onSelect: () => void;
  getStatusColor: () => string;
  formatPrice: () => string;
}
```

## 🧪 Testing

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { usePartsSearch } from '@partsy/ui';
import { PartsAPIClientFactory } from '@partsy/sdk';

function TestComponent() {
  const client = PartsAPIClientFactory.createWithMockData();
  const { results, search } = usePartsSearch({ client });

  return (
    <div>
      <button onClick={() => search({ query: 'test' })}>Search</button>
      {results?.parts.map(part => (
        <div key={part.id} data-testid="part">
          {part.name}
        </div>
      ))}
    </div>
  );
}

test('search functionality', async () => {
  render(<TestComponent />);
  
  fireEvent.click(screen.getByText('Search'));
  
  const parts = await screen.findAllByTestId('part');
  expect(parts).toHaveLength(3);
});
```

## 🔗 Integration

### Next.js App Router

```tsx
// app/search/page.tsx
'use client';
import { usePartsSearch } from '@partsy/ui';
import { createAPIClient } from '@/lib/api-client';

export default function SearchPage() {
  const { client } = createAPIClient();
  const { results, loading, search } = usePartsSearch({ client });

  return (
    <div>
      <input onChange={(e) => search({ query: e.target.value })} />
      {/* Search results */}
    </div>
  );
}
```

### React Context

```tsx
// contexts/PartsContext.tsx
import { createContext, useContext } from 'react';
import { PartsAPIClient } from '@partsy/sdk';

const PartsContext = createContext<PartsAPIClient | null>(null);

export function PartsProvider({ children, client }) {
  return (
    <PartsContext.Provider value={client}>
      {children}
    </PartsContext.Provider>
  );
}

export function usePartsAPIClient() {
  const client = useContext(PartsContext);
  if (!client) throw new Error('usePartsAPIClient must be used within PartsProvider');
  return client;
}
```

## 📈 Features

- ✅ **Headless Design** - Full styling control
- ✅ **Type Safety** - Full TypeScript support
- ✅ **React 18** - Concurrent features support
- ✅ **Error Boundaries** - Graceful error handling
- ✅ **Performance** - Optimized with React.memo and useMemo
- ✅ **Accessibility** - ARIA support built-in
- ✅ **Testing** - Easy to test with render props
