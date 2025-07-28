# @partsy/shared-utils

Shared utilities, helpers, and common functionality used across the parts search platform.

## 📦 Installation

```bash
pnpm add @partsy/shared-utils
```

## 🛠️ Utilities

### Date Utilities

```typescript
import { DateUtils } from '@partsy/shared-utils';

// Format dates consistently
const formatted = DateUtils.formatDate(new Date(), 'yyyy-MM-dd');
const relative = DateUtils.getRelativeTime(new Date()); // "2 hours ago"

// Date calculations
const future = DateUtils.addDays(new Date(), 7);
const isExpired = DateUtils.isExpired(expiryDate);

// Business day calculations
const nextBusinessDay = DateUtils.getNextBusinessDay(new Date());
const businessDaysAgo = DateUtils.getBusinessDaysBetween(startDate, endDate);
```

### Validation Utilities

```typescript
import { ValidationUtils } from '@partsy/shared-utils';

// Common validations
const isValidEmail = ValidationUtils.isEmail('user@example.com');
const isValidUrl = ValidationUtils.isUrl('https://example.com');
const isValidUuid = ValidationUtils.isUuid('123e4567-e89b-12d3-a456-426614174000');

// Part-specific validations
const isValidPartNumber = ValidationUtils.isPartNumber('RES-10K-001');
const isValidPrice = ValidationUtils.isPositiveNumber(10.50);

// Sanitization
const cleaned = ValidationUtils.sanitizeString('  Test String  '); // "Test String"
const safe = ValidationUtils.escapeHtml('<script>alert("xss")</script>');
```

### String Utilities

```typescript
import { StringUtils } from '@partsy/shared-utils';

// Case transformations
const camelCase = StringUtils.toCamelCase('hello-world'); // "helloWorld"
const kebabCase = StringUtils.toKebabCase('HelloWorld'); // "hello-world"
const titleCase = StringUtils.toTitleCase('hello world'); // "Hello World"

// Truncation and formatting
const truncated = StringUtils.truncate('Long text here', 10); // "Long te..."
const slug = StringUtils.toSlug('Parts & Components!'); // "parts-components"

// Search utilities
const highlighted = StringUtils.highlight('resistor', 'carbon resistor'); 
// "carbon <mark>resistor</mark>"

const similarity = StringUtils.similarity('resistor', 'resistors'); // 0.88
```

### Number Utilities

```typescript
import { NumberUtils } from '@partsy/shared-utils';

// Formatting
const currency = NumberUtils.formatCurrency(1234.56, 'USD'); // "$1,234.56"
const percentage = NumberUtils.formatPercentage(0.1234); // "12.34%"
const compact = NumberUtils.formatCompact(1234567); // "1.2M"

// Calculations
const rounded = NumberUtils.roundToPrecision(3.14159, 2); // 3.14
const clamped = NumberUtils.clamp(150, 0, 100); // 100

// Conversions
const bytes = NumberUtils.formatBytes(1024); // "1 KB"
const duration = NumberUtils.formatDuration(3661); // "1h 1m 1s"
```

### Array Utilities

```typescript
import { ArrayUtils } from '@partsy/shared-utils';

// Grouping and sorting
const grouped = ArrayUtils.groupBy(parts, 'category');
const sorted = ArrayUtils.sortBy(parts, 'price', 'desc');

// Deduplication
const unique = ArrayUtils.uniqueBy(parts, 'partNumber');
const distinct = ArrayUtils.distinct(['a', 'b', 'a', 'c']); // ['a', 'b', 'c']

// Chunking and pagination
const chunks = ArrayUtils.chunk(items, 10);
const page = ArrayUtils.paginate(items, 2, 10); // page 2, 10 items per page

// Filtering
const filtered = ArrayUtils.filterBy(parts, { category: 'resistors', inStock: true });
const search = ArrayUtils.searchBy(parts, 'name', 'resistor');
```

### Object Utilities

```typescript
import { ObjectUtils } from '@partsy/shared-utils';

// Deep operations
const cloned = ObjectUtils.deepClone(complexObject);
const merged = ObjectUtils.deepMerge(obj1, obj2);
const equal = ObjectUtils.deepEqual(obj1, obj2);

// Property manipulation
const picked = ObjectUtils.pick(object, ['name', 'price']); // Select specific keys
const omitted = ObjectUtils.omit(object, ['internal']); // Remove specific keys
const mapped = ObjectUtils.mapValues(object, val => val.toString());

// Path operations
const value = ObjectUtils.get(object, 'nested.property.value');
const updated = ObjectUtils.set(object, 'nested.property.value', 'new value');
const exists = ObjectUtils.has(object, 'nested.property');
```

### Error Utilities

```typescript
import { ErrorUtils } from '@partsy/shared-utils';

// Error creation
const apiError = ErrorUtils.createAPIError('Not found', 404);
const validationError = ErrorUtils.createValidationError('Invalid email', 'email');

// Error handling
const handled = ErrorUtils.handleError(error, {
  APIError: (err) => console.log('API Error:', err.message),
  ValidationError: (err) => console.log('Validation Error:', err.field),
  default: (err) => console.log('Unknown error:', err.message)
});

// Error formatting
const userFriendly = ErrorUtils.getDisplayMessage(error);
const debugInfo = ErrorUtils.getDebugInfo(error);
```

### Cache Utilities

```typescript
import { CacheUtils } from '@partsy/shared-utils';

// In-memory caching
const cache = new CacheUtils.MemoryCache<string>();

await cache.set('key', 'value', 60000); // 1 minute TTL
const value = await cache.get('key');
const exists = await cache.has('key');
await cache.delete('key');

// Cache with automatic cleanup
const autoCache = new CacheUtils.TTLCache<PartDTO>({
  maxSize: 1000,
  defaultTTL: 300000 // 5 minutes
});
```

### Event Utilities

```typescript
import { EventUtils } from '@partsy/shared-utils';

// Event emitter
const emitter = new EventUtils.TypedEventEmitter<{
  'part:created': PartCreatedEvent;
  'part:updated': PartUpdatedEvent;
}>();

// Type-safe event handling
emitter.on('part:created', (event) => {
  console.log('Part created:', event.partId);
});

emitter.emit('part:created', { partId: 'part-123' });

// Debounced events
const debouncedEmit = EventUtils.debounce(emitter.emit.bind(emitter), 300);
```

### URL Utilities

```typescript
import { UrlUtils } from '@partsy/shared-utils';

// Query string manipulation
const params = UrlUtils.parseQuery('?search=resistor&category=electronics');
const queryString = UrlUtils.buildQuery({ search: 'resistor', inStock: true });

// URL building
const apiUrl = UrlUtils.buildUrl('https://api.partsy.com', '/parts', {
  search: 'resistor',
  limit: 10
}); // "https://api.partsy.com/parts?search=resistor&limit=10"

// URL validation and parsing
const isValid = UrlUtils.isValidUrl('https://example.com');
const parsed = UrlUtils.parseUrl('https://api.partsy.com/parts?search=resistor');
```

## 🔧 Configuration

### Environment Utilities

```typescript
import { EnvUtils } from '@partsy/shared-utils';

// Environment detection
const isDev = EnvUtils.isDevelopment();
const isProd = EnvUtils.isProduction();
const isTest = EnvUtils.isTest();

// Configuration loading
const config = EnvUtils.loadConfig({
  API_URL: { required: true },
  API_KEY: { required: true, secret: true },
  TIMEOUT: { default: '5000', parse: parseInt }
});
```

### Logger Utilities

```typescript
import { LoggerUtils } from '@partsy/shared-utils';

// Structured logging
const logger = LoggerUtils.createLogger('parts-service');

logger.info('User action', { userId: '123', action: 'search' });
logger.warn('Slow query detected', { duration: 2000, query: 'parts search' });
logger.error('API error', { error: apiError, context: 'part creation' });

// Context logging
const contextLogger = logger.child({ requestId: 'req-123' });
contextLogger.info('Processing request'); // Includes requestId in all logs
```

## 🧪 Testing Utilities

```typescript
import { TestUtils } from '@partsy/shared-utils';

// Test data factories
const mockPart = TestUtils.createMockPart({
  name: 'Test Resistor',
  price: 1.50
});

const mockUser = TestUtils.createMockUser({
  email: 'test@example.com'
});

// Test helpers
const delayed = await TestUtils.delay(100); // Wait 100ms
const random = TestUtils.randomString(10); // Random 10-char string
const uuid = TestUtils.generateUuid(); // Test UUID

// Mock utilities
const mockFn = TestUtils.createMockFunction<(id: string) => Promise<Part>>();
mockFn.mockResolvedValue(mockPart);
```

## 📊 Types

```typescript
// Common utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type Awaitable<T> = T | Promise<T>;

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event types
export interface TypedEventMap {
  [event: string]: any;
}

export interface CacheOptions {
  maxSize?: number;
  defaultTTL?: number;
  cleanupInterval?: number;
}
```

## 🔗 Integration

Used by all other packages in the monorepo:

- **[@partsy/sdk](../parts-sdk/)** - HTTP utilities, validation
- **[@partsy/ui](../parts-ui/)** - String formatting, array operations  
- **[@partsy/parts-domain](../parts-domain/)** - Validation, error handling
- **[@partsy/parts-application](../parts-application/)** - Event handling, caching

## 📈 Features

- ✅ **Pure Utilities** - No business logic dependencies
- ✅ **Type Safety** - Full TypeScript support with generics
- ✅ **Tree Shakeable** - Import only what you need
- ✅ **Well Tested** - 100% test coverage
- ✅ **Performance** - Optimized algorithms
- ✅ **Cross-Platform** - Works in Node.js and browsers
- ✅ **Zero Dependencies** - Standalone utility functions
