## Type Architecture Problems & Solutions

### ❌ Current Problems

1. **Code Duplication**: `PartDTO` defined in 4+ places
2. **Maintenance Burden**: Changes require updates across multiple files
3. **Type Drift**: Definitions can become inconsistent over time
4. **Build Complexity**: False circular dependency concerns

### ✅ Architectural Solutions

#### Option 1: Centralized Types Package (Recommended)

```
packages/
  parts-types/          # 🎯 Single source of truth
    src/
      domain.ts         # Domain types (PartDTO, etc.)
      api.ts           # API request/response types
      ui.ts            # UI-specific types
      shared.ts        # Common utility types
```

**Benefits:**
- Single source of truth for all types
- Easy to maintain and evolve
- Clear dependency graph
- Type safety across all packages

**Usage:**
```typescript
// In any package
import type { PartDTO, SearchPartsDTO } from '@partsy/types';
```

#### Option 2: Layer-Based Type Ownership

```
packages/
  parts-domain/         # 🏛️ Domain entities and value objects
    src/types/core.ts
  parts-application/    # 📋 DTOs and use case contracts
    src/types/dtos.ts  
  parts-sdk/           # 🌐 API client contracts
    src/types/api.ts
```

**Benefits:**
- Types live where they belong conceptually
- Clear ownership boundaries
- Follows clean architecture principles

#### Option 3: Contract-First Design

```
packages/
  parts-contracts/      # 📜 Interface definitions only
    src/
      domain.contracts.ts    # Domain interfaces
      api.contracts.ts       # API interfaces  
      ui.contracts.ts        # UI component interfaces
```

**Benefits:**
- Explicit contracts between layers
- Easy to mock and test
- Clear API boundaries

### 🏗️ Implementation Strategy

#### Phase 1: Immediate Fix (✅ Done)
- Remove duplicate `PartDTO` definitions
- Use existing `@partsy/sdk` types
- Update imports across packages

#### Phase 2: Create Types Package
```bash
# Create centralized types
mkdir -p packages/parts-types/src
# Move all type definitions
# Update all package.json dependencies
```

#### Phase 3: Establish Type Ownership Rules
```typescript
// Domain layer owns business concepts
export interface Part { ... }

// Application layer owns DTOs  
export interface PartDTO { ... }

// Infrastructure layer owns implementation details
export interface PartRepository { ... }

// UI layer owns presentation concerns
export interface PartsSearchProps { ... }
```

### 🔄 Dependency Flow (Fixed)

```
┌─────────────────┐
│   @partsy/ui    │───┐
└─────────────────┘   │
                      ▼
┌─────────────────┐ ┌─────────────────┐
│@partsy/app      │ │  @partsy/sdk    │ ✅ Single source
└─────────────────┘ └─────────────────┘
        │                     ▲
        ▼                     │
┌─────────────────┐           │
│@partsy/domain   │───────────┘
└─────────────────┘
```

**Rules:**
1. UI layer imports from SDK (presentation types)
2. SDK imports from Application (DTOs)  
3. Application imports from Domain (entities)
4. No circular dependencies
5. Types flow downstream only

### 🎯 Best Practices

#### 1. Type Naming Conventions
```typescript
// Domain entities (no suffix)
interface Part { ... }

// Data Transfer Objects  
interface PartDTO { ... }

// API Request/Response
interface SearchPartsRequest { ... }
interface SearchPartsResponse { ... }

// UI Props
interface PartsSearchProps { ... }
```

#### 2. Type Re-exports
```typescript
// In @partsy/types/index.ts
export type { PartDTO } from './domain';
export type { SearchPartsRequest } from './api';

// In consuming packages
import type { PartDTO } from '@partsy/types';
```

#### 3. Generic Type Utilities
```typescript
// Reusable type utilities
export type APIResponse<T> = {
  data: T;
  status: number;
  message?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};
```

### 🚀 Migration Path

1. **Immediate** (✅): Use existing SDK types, remove duplicates
2. **Short-term**: Create `@partsy/types` package
3. **Medium-term**: Establish clear type ownership rules  
4. **Long-term**: Implement contract-first design patterns

This eliminates code duplication while maintaining clean architecture principles!
