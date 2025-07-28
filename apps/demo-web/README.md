# Demo Web App

Interactive demo of the Parts Search SDK and UI components.

## 🚀 Quick Start

```bash
# From project root
pnpm dev --filter demo-web

# Or from this directory
pnpm dev
```

Visit [http://localhost:3001](http://localhost:3001) to see the demo.

## 🎯 What's Demonstrated

### API Client Usage
- **[@partsy/sdk](../../packages/parts-sdk/)** - Complete API client implementation
- Mock data integration for offline development
- Error handling and retry logic
- TypeScript integration

### UI Components
- **[@partsy/ui](../../packages/parts-ui/)** - React hooks and components
- Parts search with real-time filtering
- Part selection and details view
- Loading states and error handling

### Architecture Patterns
- SOLID principles implementation
- Clean architecture layers
- Dependency injection
- Strategy patterns

## 🔧 Features

- **Parts Search** - Search with filters (name, category, price range)
- **Part Details** - View individual part information
- **Mock Data** - 50+ sample parts for testing
- **Responsive Design** - Works on desktop and mobile
- **Error Handling** - Graceful error states
- **Loading States** - Skeleton loading animations

## 🏗️ Code Examples

### Basic Search

The demo shows how to use the SDK and UI components together:

```tsx
import { usePartsSearch } from '@partsy/ui';
import { createAPIClient } from '../lib/api-client';

function SearchDemo() {
  const { client } = createAPIClient();
  const { results, loading, search } = usePartsSearch({ client });

  return (
    <div>
      <input 
        onChange={(e) => search({ query: e.target.value })}
        placeholder="Search parts..."
      />
      {results?.parts.map(part => (
        <div key={part.id}>
          {part.name} - ${part.price}
        </div>
      ))}
    </div>
  );
}
```

### Configuration

Environment variables for different modes:

```bash
# Use mock data (default)
NEXT_PUBLIC_USE_MOCK_DATA=true

# Use real API
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/v1
PARTSY_API_KEY=your-api-key
```

## 📱 Pages

- **`/`** - Homepage with getting started info
- **`/demo`** - Interactive parts search demo
- **`/demo/page-new`** - Alternative demo layout

## 🧪 Testing Ground

This app serves as a testing ground for:

- New SDK features
- UI component updates  
- Integration patterns
- Performance optimizations

## 📚 Learning Resources

Use this demo to understand:

1. **SDK Integration** - How to set up and configure the API client
2. **React Hooks** - Using `usePartsSearch` and other custom hooks
3. **Error Handling** - Proper error boundaries and user feedback
4. **TypeScript** - Full type safety in React applications
5. **Performance** - Optimized rendering and state management

Perfect for developers learning the platform or testing new features!
