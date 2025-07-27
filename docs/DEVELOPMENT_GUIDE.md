# Development Guide - Parts Search SaaS

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Development Workflow](#development-workflow)
3. [Adding New Features](#adding-new-features)
4. [Testing Strategy](#testing-strategy)
5. [Code Quality Guidelines](#code-quality-guidelines)
6. [Common Patterns](#common-patterns)
7. [Troubleshooting](#troubleshooting)

## Architecture Overview

### Monorepo Structure
```
parts-search-saas/
├── apps/
│   ├── demo-web/          # Next.js demo application
│   ├── docs/              # Documentation site
│   └── web/               # Main web application
├── packages/
│   ├── parts-sdk/         # 🎯 Core SDK (SOLID architecture)
│   ├── parts-domain/      # Domain entities and logic
│   ├── parts-application/ # Use cases and DTOs
│   ├── parts-infrastructure/ # External adapters
│   ├── parts-ui/          # Shared React components
│   ├── shared-kernel/     # Common utilities
│   └── typescript-config/ # Shared TypeScript configs
└── docs/                  # Project documentation
```

### Domain-Driven Design Layers

1. **Domain Layer** (`packages/parts-domain/`)
   - Pure business logic
   - No external dependencies
   - Entities, Value Objects, Domain Services

2. **Application Layer** (`packages/parts-application/`)
   - Use cases and orchestration
   - DTOs for data transfer
   - Interfaces for repositories

3. **Infrastructure Layer** (`packages/parts-infrastructure/`)
   - External adapters (databases, APIs)
   - Implementation of repository interfaces
   - Framework-specific code

4. **Presentation Layer** (`apps/*/`, `packages/parts-ui/`)
   - User interfaces
   - Controllers and API endpoints
   - React components and pages

## Development Workflow

### 1. Setting Up Development Environment

```bash
# Clone and install dependencies
git clone <repo-url>
cd parts-search-saas
pnpm install

# Build all packages
pnpm build

# Start development servers
pnpm dev  # Starts all apps in development mode
# OR for specific app:
pnpm dev --filter demo-web
```

### 2. Branch Strategy

```bash
# Feature development
git checkout -b feature/add-new-search-filter
git checkout -b bugfix/fix-retry-logic
git checkout -b refactor/improve-caching

# Always branch from development
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```

### 3. Development Commands

```bash
# Build specific package
pnpm build --filter @partsy/sdk

# Run tests
pnpm test
pnpm test --filter @partsy/sdk

# Type checking
pnpm type-check

# Linting
pnpm lint
pnpm lint:fix

# Clean and rebuild
pnpm clean
pnpm build
```

## Adding New Features

### 1. Following SOLID Principles

#### Before Adding Any Feature, Ask:
- **SRP**: Does this class/function have a single reason to change?
- **OCP**: Can I extend behavior without modifying existing code?
- **LSP**: Can implementations be substituted without breaking functionality?
- **ISP**: Are interfaces focused and minimal?
- **DIP**: Am I depending on abstractions, not concretions?

#### Example: Adding a New Authentication Strategy

**Step 1: Define the Contract (if needed)**
```typescript
// packages/parts-sdk/src/contracts/index.ts
export interface AuthenticationStrategy {
  authenticate(headers: Record<string, string>): Record<string, string>;
  isExpired?(): boolean; // Optional method for token expiration
}
```

**Step 2: Implement the Strategy**
```typescript
// packages/parts-sdk/src/infrastructure/auth/strategies.ts
export class OAuth2AuthStrategy implements AuthenticationStrategy {
  constructor(
    private clientId: string,
    private clientSecret: string,
    private tokenEndpoint: string
  ) {}

  authenticate(headers: Record<string, string>): Record<string, string> {
    // Implementation follows SRP - only handles OAuth2 authentication
    return {
      ...headers,
      'Authorization': `Bearer ${this.getToken()}`
    };
  }

  isExpired(): boolean {
    // Single responsibility for token expiration logic
    return this.tokenExpiresAt < Date.now();
  }

  private async getToken(): Promise<string> {
    // OAuth2 token acquisition logic
  }
}
```

**Step 3: Add to Factory/Builder**
```typescript
// packages/parts-sdk/src/client/PartsAPIClientFactory.ts
export class PartsAPIClientBuilder {
  withOAuth2(clientId: string, clientSecret: string, tokenEndpoint: string): this {
    this.authStrategy = new OAuth2AuthStrategy(clientId, clientSecret, tokenEndpoint);
    return this;
  }
}
```

**Step 4: Write Tests**
```typescript
// packages/parts-sdk/tests/auth/OAuth2AuthStrategy.test.ts
describe('OAuth2AuthStrategy', () => {
  it('should add Bearer token to headers', () => {
    const strategy = new OAuth2AuthStrategy('client', 'secret', 'endpoint');
    const headers = strategy.authenticate({});
    expect(headers.Authorization).toMatch(/^Bearer /);
  });
});
```

### 2. Adding New Domain Features

#### Example: Adding Product Categories

**Step 1: Domain Entity**
```typescript
// packages/parts-domain/src/entities/Category.ts
import { CategoryId } from '../value-objects/CategoryId';

export class Category {
  constructor(
    private readonly id: CategoryId,
    private name: string,
    private description?: string,
    private parentId?: CategoryId
  ) {}

  // Domain methods with business logic
  public changeName(newName: string): void {
    if (!newName.trim()) {
      throw new Error('Category name cannot be empty');
    }
    this.name = newName;
  }

  public isSubcategoryOf(category: Category): boolean {
    return this.parentId?.equals(category.getId()) ?? false;
  }

  // Getters
  public getId(): CategoryId { return this.id; }
  public getName(): string { return this.name; }
}
```

**Step 2: Repository Interface**
```typescript
// packages/parts-domain/src/repositories/CategoryRepository.ts
export interface CategoryRepository {
  findById(id: CategoryId): Promise<Category | null>;
  findByParentId(parentId: CategoryId): Promise<Category[]>;
  save(category: Category): Promise<void>;
  delete(id: CategoryId): Promise<void>;
}
```

**Step 3: Application Use Case**
```typescript
// packages/parts-application/src/use-cases/CreateCategoryUseCase.ts
export class CreateCategoryUseCase {
  constructor(
    private categoryRepository: CategoryRepository
  ) {}

  async execute(request: CreateCategoryRequest): Promise<CategoryResponse> {
    // Validation
    if (!request.name.trim()) {
      throw new ValidationError('Category name is required');
    }

    // Create domain entity
    const categoryId = CategoryId.generate();
    const category = new Category(
      categoryId,
      request.name,
      request.description,
      request.parentId
    );

    // Persist
    await this.categoryRepository.save(category);

    // Return response
    return {
      id: category.getId().value,
      name: category.getName(),
      description: category.getDescription()
    };
  }
}
```

### 3. Adding New UI Components

#### Example: Category Selector Component

**Step 1: Create Reusable Component**
```typescript
// packages/parts-ui/src/components/CategorySelector.tsx
import React from 'react';

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: string;
  onCategorySelect: (categoryId: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  placeholder = "Select a category",
  disabled = false
}) => {
  // Component follows SRP - only handles category selection UI
  return (
    <select 
      value={selectedCategoryId || ''} 
      onChange={(e) => onCategorySelect(e.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};
```

**Step 2: Create Hook for Business Logic**
```typescript
// packages/parts-ui/src/hooks/useCategories.ts
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      // Use dependency injection - don't hardcode the client
      const client = usePartsAPIClient();
      const result = await client.getCategories();
      setCategories(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, []);

  return { categories, loading, error, loadCategories };
};
```

## Testing Strategy

### 1. Unit Testing

#### Domain Layer Tests
```typescript
// packages/parts-domain/tests/entities/Category.test.ts
describe('Category', () => {
  describe('changeName', () => {
    it('should change name when valid', () => {
      const category = new Category(CategoryId.generate(), 'Original');
      category.changeName('New Name');
      expect(category.getName()).toBe('New Name');
    });

    it('should throw error when name is empty', () => {
      const category = new Category(CategoryId.generate(), 'Original');
      expect(() => category.changeName('')).toThrow('Category name cannot be empty');
    });
  });
});
```

#### Strategy Pattern Tests
```typescript
// packages/parts-sdk/tests/infrastructure/retry/ExponentialBackoffRetryStrategy.test.ts
describe('ExponentialBackoffRetryStrategy', () => {
  let strategy: ExponentialBackoffRetryStrategy;

  beforeEach(() => {
    strategy = new ExponentialBackoffRetryStrategy(3, 1000, 10000);
  });

  it('should calculate exponential backoff delays', () => {
    expect(strategy.getRetryDelay(1)).toBe(1000);
    expect(strategy.getRetryDelay(2)).toBe(2000);
    expect(strategy.getRetryDelay(3)).toBe(4000);
  });

  it('should not exceed maximum delay', () => {
    const longStrategy = new ExponentialBackoffRetryStrategy(10, 1000, 5000);
    expect(longStrategy.getRetryDelay(10)).toBeLessThanOrEqual(5000);
  });
});
```

### 2. Integration Testing

#### API Client Integration Tests
```typescript
// packages/parts-sdk/tests/integration/PartsAPIClient.integration.test.ts
describe('PartsAPIClient Integration', () => {
  let client: PartsAPIClient;
  let mockHttpClient: MockHttpClient;

  beforeEach(() => {
    mockHttpClient = new MockHttpClient();
    client = new PartsAPIClient({
      baseUrl: 'https://test-api.com',
      httpClient: mockHttpClient,
      retryStrategy: new ExponentialBackoffRetryStrategy(2),
      authStrategy: new BearerTokenAuthStrategy('test-token'),
      dataTransformer: new DateTransformer()
    });
  });

  it('should retry failed requests', async () => {
    // Setup mock to fail first call, succeed on second
    mockHttpClient.mockFailure().mockSuccess({ id: '1', name: 'Test Part' });

    const result = await client.getPartById('1');

    expect(mockHttpClient.getRequestCount()).toBe(2);
    expect(result.name).toBe('Test Part');
  });
});
```

### 3. End-to-End Testing

#### User Journey Tests
```typescript
// apps/demo-web/tests/e2e/parts-search.e2e.test.ts
describe('Parts Search Journey', () => {
  it('should allow user to search and view part details', async () => {
    // Given: User is on the search page
    await page.goto('/demo');

    // When: User searches for a part
    await page.fill('[data-testid="search-input"]', 'test part');
    await page.click('[data-testid="search-button"]');

    // Then: Results should be displayed
    await expect(page.locator('[data-testid="search-results"]')).toBeVisible();
    
    // When: User clicks on a result
    await page.click('[data-testid="part-result"]:first-child');

    // Then: Part details should be shown
    await expect(page.locator('[data-testid="part-details"]')).toBeVisible();
  });
});
```

## Code Quality Guidelines

### 1. TypeScript Best Practices

#### Strict Type Safety
```typescript
// ✅ Good: Use strict types
interface CreatePartRequest {
  readonly partNumber: string;
  readonly name: string;
  readonly description?: string;
  readonly price: number;
  readonly categoryId: CategoryId;
}

// ❌ Bad: Use any or loose types
interface CreatePartRequest {
  [key: string]: any;
}
```

#### Discriminated Unions for State
```typescript
// ✅ Good: Use discriminated unions
type LoadingState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: Part[] }
  | { status: 'error'; error: string };

// ❌ Bad: Separate booleans
interface State {
  loading: boolean;
  error: string | null;
  data: Part[] | null;
}
```

### 2. Error Handling

#### Custom Error Classes
```typescript
// ✅ Good: Specific error types
export class PartNotFoundError extends Error {
  constructor(partId: string) {
    super(`Part with ID ${partId} not found`);
    this.name = 'PartNotFoundError';
  }
}

export class InvalidPartDataError extends Error {
  constructor(message: string, public readonly field: string) {
    super(message);
    this.name = 'InvalidPartDataError';
  }
}
```

#### Error Boundaries for React
```typescript
// packages/parts-ui/src/components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}
```

### 3. Performance Considerations

#### Lazy Loading
```typescript
// ✅ Good: Lazy load heavy components
const PartsSearch = React.lazy(() => import('./PartsSearch'));

function App() {
  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <PartsSearch />
    </React.Suspense>
  );
}
```

#### Memoization for Expensive Calculations
```typescript
// ✅ Good: Memoize expensive computations
const useFilteredParts = (parts: Part[], filters: SearchFilters) => {
  return useMemo(() => {
    return parts.filter(part => {
      if (filters.category && part.categoryId !== filters.category) return false;
      if (filters.minPrice && part.price < filters.minPrice) return false;
      if (filters.maxPrice && part.price > filters.maxPrice) return false;
      return true;
    });
  }, [parts, filters]);
};
```

## Common Patterns

### 1. Repository Pattern with Dependency Injection

```typescript
// Infrastructure implementation
export class HTTPPartsRepository implements PartsRepository {
  constructor(
    private httpClient: HttpClient,
    private urlBuilder: URLBuilder
  ) {}

  async findById(id: PartId): Promise<Part | null> {
    try {
      const url = this.urlBuilder.buildPartUrl(id.value);
      const response = await this.httpClient.get<PartDTO>(url);
      return this.mapToDomain(response.data);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return null;
      }
      throw error;
    }
  }
}

// Dependency injection in app
const container = new Container();
container.bind<PartsRepository>('PartsRepository').to(HTTPPartsRepository);
container.bind<HttpClient>('HttpClient').to(FetchHttpClient);
```

### 2. Command Query Responsibility Segregation (CQRS)

```typescript
// Commands (write operations)
export interface Command {
  readonly type: string;
}

export class CreatePartCommand implements Command {
  readonly type = 'CREATE_PART';
  constructor(public readonly data: CreatePartRequest) {}
}

// Command Handlers
export class CreatePartCommandHandler {
  constructor(
    private partsRepository: PartsRepository,
    private eventBus: EventBus
  ) {}

  async handle(command: CreatePartCommand): Promise<void> {
    const part = Part.create(command.data);
    await this.partsRepository.save(part);
    
    // Publish domain event
    await this.eventBus.publish(new PartCreatedEvent(part.getId()));
  }
}

// Queries (read operations)
export class GetPartByIdQuery {
  constructor(public readonly partId: string) {}
}

export class GetPartByIdQueryHandler {
  constructor(private partsReadModel: PartsReadModel) {}

  async handle(query: GetPartByIdQuery): Promise<PartView | null> {
    return this.partsReadModel.findById(query.partId);
  }
}
```

### 3. Event-Driven Architecture

```typescript
// Domain Events
export class PartCreatedEvent {
  constructor(
    public readonly partId: PartId,
    public readonly occurredAt: Date = new Date()
  ) {}
}

// Event Handlers
export class SendPartCreatedNotificationHandler {
  constructor(private notificationService: NotificationService) {}

  async handle(event: PartCreatedEvent): Promise<void> {
    await this.notificationService.send({
      type: 'PART_CREATED',
      partId: event.partId.value,
      timestamp: event.occurredAt
    });
  }
}

// Event Bus
export interface EventBus {
  publish(event: DomainEvent): Promise<void>;
  subscribe<T extends DomainEvent>(
    eventType: string, 
    handler: (event: T) => Promise<void>
  ): void;
}
```

### 4. Factory Pattern for Complex Objects

```typescript
export class PartsAPIClientFactory {
  static createForEnvironment(env: Environment): PartsAPIClient {
    const config = this.getEnvironmentConfig(env);
    
    return new PartsAPIClientBuilder()
      .setBaseUrl(config.baseUrl)
      .withRetryStrategy(this.createRetryStrategy(config))
      .withAuthStrategy(this.createAuthStrategy(config))
      .withHttpClient(this.createHttpClient(config))
      .build();
  }

  private static createRetryStrategy(config: EnvironmentConfig): RetryStrategy {
    switch (config.retryType) {
      case 'exponential':
        return new ExponentialBackoffRetryStrategy(
          config.maxRetries,
          config.baseDelay,
          config.maxDelay
        );
      case 'fixed':
        return new FixedDelayRetryStrategy(config.maxRetries, config.baseDelay);
      default:
        return new NoRetryStrategy();
    }
  }
}
```

## Troubleshooting

### 1. Build Issues

#### TypeScript Compilation Errors
```bash
# Clear build cache
pnpm clean
rm -rf node_modules/.cache
rm -rf .next

# Rebuild with verbose output
pnpm build --verbose

# Check for circular dependencies
npx madge --circular packages/parts-sdk/src/index.ts
```

#### Missing Dependencies
```bash
# Check workspace dependencies
pnpm list --depth=0
pnpm why @partsy/sdk

# Update dependencies
pnpm update
```

### 2. Runtime Issues

#### Debug API Client Issues
```typescript
// Enable debug logging
const client = new PartsAPIClientBuilder()
  .setBaseUrl('https://api.example.com')
  .withLogging(new ConsoleLogger('DEBUG'))
  .build();

// Mock HTTP client for testing
const mockClient = new PartsAPIClientBuilder()
  .withHttpClient(new MockHttpClient())
  .build();
```

#### Memory Leaks in React
```typescript
// Use cleanup in useEffect
useEffect(() => {
  const subscription = dataStream.subscribe(handleData);
  
  return () => {
    subscription.unsubscribe(); // Cleanup
  };
}, []);

// Cancel pending requests
useEffect(() => {
  const abortController = new AbortController();
  
  fetchData(abortController.signal);
  
  return () => {
    abortController.abort();
  };
}, []);
```

### 3. Testing Issues

#### Mocking External Dependencies
```typescript
// Mock HTTP client
jest.mock('@partsy/sdk', () => ({
  PartsAPIClientFactory: {
    create: jest.fn(() => ({
      searchParts: jest.fn().mockResolvedValue({ data: [] })
    }))
  }
}));

// Mock timers
jest.useFakeTimers();
// ... test code ...
jest.runAllTimers();
jest.useRealTimers();
```

### 4. Performance Issues

#### Bundle Size Analysis
```bash
# Analyze bundle size
npx @next/bundle-analyzer
npm run build -- --analyze

# Check for duplicate dependencies
npx npm-check-duplicates
```

#### React Performance
```typescript
// Profile component renders
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
  console.log('Component', id, 'rendered in', actualDuration, 'ms');
}

<Profiler id="PartsSearch" onRender={onRenderCallback}>
  <PartsSearch />
</Profiler>
```

## Continuous Integration

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm type-check
      - run: pnpm test
      - run: pnpm build
```

### 2. Code Quality Gates

```json
// package.json
{
  "scripts": {
    "pre-commit": "lint-staged",
    "pre-push": "pnpm test && pnpm build"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

This development guide provides a comprehensive foundation for maintaining code quality and architectural consistency as the project grows. Always refer back to these patterns and practices when implementing new features or making changes to existing code.
