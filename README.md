# Parts Search SaaS

A comprehensive parts search and inventory management platform built with TypeScript, React, and clean architecture principles.

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start demo application
pnpm dev --filter demo-web
```

Visit [http://localhost:3001](http://localhost:3001) to see the demo.

## 📦 Packages

### Core Libraries
- **[@partsy/sdk](./packages/parts-sdk/)** - TypeScript API client with SOLID architecture
- **[@partsy/ui](./packages/parts-ui/)** - React components and hooks for parts search
- **[@partsy/shared-utils](./packages/shared-kernel/)** - Shared utilities and helpers

### Domain & Application
- **[@partsy/parts-domain](./packages/parts-domain/)** - Business entities and rules
- **[@partsy/parts-application](./packages/parts-application/)** - Use cases and DTOs
- **[@partsy/parts-infrastructure](./packages/parts-infrastructure/)** - External adapters

### Configuration
- **[@partsy/tsconfig](./packages/typescript-config/)** - Shared TypeScript configs
- **[@partsy/eslint-config](./packages/eslint-config/)** - ESLint configurations

## 🔧 Usage

### Install Packages

```bash
# For application development
pnpm add @partsy/sdk @partsy/ui

# For configuration
pnpm add -D @partsy/tsconfig @partsy/eslint-config
```

### Basic API Client

```typescript
import { PartsAPIClientFactory } from '@partsy/sdk';

const client = PartsAPIClientFactory.create({
  environment: 'development',
  apiKey: 'your-api-key'
});

const parts = await client.searchParts({ query: 'resistor' });
```

### React Components

```tsx
import { usePartsSearch } from '@partsy/ui';

function SearchDemo() {
  const { results, loading, search } = usePartsSearch({ client });
  
  return (
    <div>
      <button onClick={() => search({ query: 'capacitor' })}>
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

## 🏗️ Architecture

This project follows **Domain-Driven Design** with **SOLID principles**:

- **Domain Layer**: Pure business logic (entities, value objects)
- **Application Layer**: Use cases and orchestration
- **Infrastructure Layer**: External adapters (APIs, databases)
- **Presentation Layer**: UI components and applications

Key patterns: Strategy, Factory, Builder, Dependency Injection.

## 🧪 Development

```bash
# Run tests
pnpm test

# Type checking
pnpm type-check

# Linting
pnpm lint

# Build specific package
pnpm build --filter @partsy/sdk
```

## 📚 Documentation

- **[Development Guide](./docs/DEVELOPMENT_GUIDE.md)** - Complete development practices
- **[API Integration](./docs/REAL_API_INTEGRATION.md)** - Connect to real backend
- **[Quick Reference](./docs/QUICK_REFERENCE.md)** - Common patterns and commands
- **[Architecture Details](./docs/SOLID_PRINCIPLES_REFACTORING.md)** - SOLID implementation

## 🚀 Applications

- **[demo-web](./apps/demo-web/)** - Parts search demo with mock data

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🚀 Quick Start

Install the packages you need:

```bash
# Core SDK for API communication
pnpm add @partsy/sdk

# Headless UI components and hooks
pnpm add @partsy/ui

# TypeScript configuration (optional)
pnpm add -D @partsy/tsconfig
```

## 📦 Packages

- **`@partsy/sdk`** - Stateless TypeScript client for parts search API
- **`@partsy/ui`** - Headless React components and hooks with Tailwind styling
- **`@partsy/parts-domain`** - Domain entities and contracts
- **`@partsy/shared-utils`** - Shared utilities and helpers
- **`@partsy/tsconfig`** - Shared TypeScript configuration

## 🔧 Usage

### Basic SDK Usage

```typescript
import { createPartsAPIClient } from '@partsy/sdk';

const client = createPartsAPIClient({
  baseUrl: 'https://api.partsy.com',
  apiKey: 'your-api-key'
});

// Search for parts
const results = await client.searchParts({
  name: 'engine',
  category: 'automotive',
  inStock: true
});

// Get specific part
const part = await client.getPartById('part-123');
```

### Headless UI Components

```tsx
import { PartsSearch, PartCard } from '@partsy/ui';
import type { PartDTO } from '@partsy/ui';

function MyPartsSearch({ parts }: { parts: PartDTO[] }) {
  return (
    <PartsSearch parts={parts}>
      {({ parts, selectedPart, onPartSelect }) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parts.map(part => (
            <PartCard 
              key={part.id} 
              part={part}
              isSelected={selectedPart?.id === part.id}
              onSelect={onPartSelect}
            >
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
      )}
    </PartsSearch>
  );
}
```

### Custom Hooks

```tsx
import { usePartsSearch, usePartSelection } from '@partsy/ui';

function SearchExample() {
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

  const { selectedPart, selectPart, clearSelection } = usePartSelection();

  return (
    <div>
      <button onClick={search} disabled={loading}>
        {loading ? 'Searching...' : 'Search Parts'}
      </button>
      
      {results && (
        <div>
          {results.parts.map(part => (
            <button key={part.id} onClick={() => selectPart(part)}>
              {part.name} - ${part.price}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

## 🏗️ Architecture

This is a **public-facing repository** following Domain-Driven Design principles:

- **Stateless only** - No database credentials or private business logic
- **ESM + strict TypeScript** - Modern module system with type safety
- **Headless components** - Flexible UI components using render props
- **No default exports** - Named exports for better tree-shaking

## 🔗 Real API Integration

The SDK is production-ready for real API integration. Currently using mock data for demonstration.

### Quick Setup for Real API

1. **Update environment variables:**
```bash
# Disable mock data
NEXT_PUBLIC_USE_MOCK_DATA=false

# Configure real API
NEXT_PUBLIC_API_BASE_URL=https://your-api.com/v1
PARTSY_API_KEY=your-api-key
```

2. **Use the enhanced client:**
```typescript
import { PartsAPIClientFactory } from '@partsy/sdk';

const client = PartsAPIClientFactory.create({
  environment: 'production',
  apiKey: process.env.PARTSY_API_KEY
});
```

📋 **See [Real API Integration Guide](./docs/REAL_API_INTEGRATION.md) for complete setup instructions.**

📋 **See [API Specification](./docs/api-specification.yaml) for backend requirements.**

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build all packages
pnpm build

# Run linting
pnpm lint

# Check types
pnpm check-types
```

## 📋 Requirements

- Node.js ≥ 18
- pnpm ≥ 9.0.0
- React ≥ 18.0.0 (for UI components)

## 🤝 Contributing

1. Follow the established patterns for stateless, public-facing code
2. Maintain ≥ 90% test coverage
3. Use Vitest for testing
4. Components must be headless-friendly with render props
5. Never include backend secrets or private business logic

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Note**: This public repository contains only the stateless SDK and UI components. The private implementation details, infrastructure, and business logic are maintained separately.

This project demonstrates a clean implementation of Domain-Driven Design (DDD) principles for a parts search and inventory management system.

## Architecture Overview

The project follows DDD principles with clear separation of concerns across multiple layers:
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
