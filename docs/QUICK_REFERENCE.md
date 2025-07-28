# Quick Reference - Daily Development

## 🚀 Commands

```bash
# Setup
pnpm install && pnpm build

# Development
pnpm dev --filter demo-web    # Start demo
pnpm dev --filter docs        # Start docs

# Testing & Quality
pnpm test                     # All tests
pnpm lint                     # Lint code
pnpm type-check              # TypeScript validation
```

## 📦 Package Usage

### Install Dependencies
```bash
# Core packages
pnpm add @partsy/sdk @partsy/ui

# Development tools  
pnpm add -D @partsy/tsconfig @partsy/eslint-config
```

### Basic API Client
```typescript
import { PartsAPIClientFactory } from '@partsy/sdk';

// Simple setup
const client = PartsAPIClientFactory.create({
  environment: 'development',
  apiKey: 'your-key'
});

// Mock for testing
const mockClient = PartsAPIClientFactory.createWithMockData();
```

### React Components
```tsx
import { usePartsSearch } from '@partsy/ui';

function SearchComponent() {
  const { results, loading, search } = usePartsSearch({ client });
  
  return (
    <div>
      <input onChange={(e) => search({ query: e.target.value })} />
      {results?.parts.map(part => (
        <div key={part.id}>{part.name} - ${part.price}</div>
      ))}
    </div>
  );
}
```

## 🏗️ SOLID Patterns Quick Reference

### 1. Single Responsibility Principle (SRP)
```typescript
// ✅ Good: Each class has one responsibility
class UserValidator {
  validate(user: User): ValidationResult { /* ... */ }
}

class UserRepository {
  save(user: User): Promise<void> { /* ... */ }
}

class UserNotificationService {
  notifyUserCreated(user: User): Promise<void> { /* ... */ }
}

// ❌ Bad: Multiple responsibilities
class UserService {
  validate(user: User): ValidationResult { /* ... */ }
  save(user: User): Promise<void> { /* ... */ }
  sendEmail(user: User): Promise<void> { /* ... */ }
  generateReport(user: User): Report { /* ... */ }
}
```

### 2. Open/Closed Principle (OCP)
```typescript
// ✅ Good: Open for extension, closed for modification
interface PaymentProcessor {
  process(amount: number): Promise<PaymentResult>;
}

class CreditCardProcessor implements PaymentProcessor {
  process(amount: number): Promise<PaymentResult> { /* ... */ }
}

class PayPalProcessor implements PaymentProcessor {
  process(amount: number): Promise<PaymentResult> { /* ... */ }
}

// Adding new payment method doesn't modify existing code
class CryptoProcessor implements PaymentProcessor {
  process(amount: number): Promise<PaymentResult> { /* ... */ }
}
```

### 3. Liskov Substitution Principle (LSP)
```typescript
// ✅ Good: Subtypes are substitutable
interface Bird {
  makeSound(): string;
}

class Sparrow implements Bird {
  makeSound(): string { return "chirp"; }
}

class Robin implements Bird {
  makeSound(): string { return "tweet"; }
}

// Both can be used interchangeably
function makeBirdSound(bird: Bird): string {
  return bird.makeSound(); // Works with any Bird implementation
}
```

### 4. Interface Segregation Principle (ISP)
```typescript
// ✅ Good: Focused interfaces
interface Readable {
  read(): Promise<Data>;
}

interface Writable {
  write(data: Data): Promise<void>;
}

interface Deletable {
  delete(id: string): Promise<void>;
}

// Classes implement only what they need
class ReadOnlyRepository implements Readable {
  read(): Promise<Data> { /* ... */ }
}

class FullRepository implements Readable, Writable, Deletable {
  read(): Promise<Data> { /* ... */ }
  write(data: Data): Promise<void> { /* ... */ }
  delete(id: string): Promise<void> { /* ... */ }
}
```

### 5. Dependency Inversion Principle (DIP)
```typescript
// ✅ Good: Depend on abstractions
interface Logger {
  log(message: string): void;
}

class UserService {
  constructor(
    private userRepository: UserRepository,
    private logger: Logger // Abstraction, not concrete class
  ) {}

  async createUser(userData: CreateUserData): Promise<User> {
    this.logger.log('Creating user...');
    return this.userRepository.save(new User(userData));
  }
}

// Concrete implementations
class ConsoleLogger implements Logger {
  log(message: string): void { console.log(message); }
}

class FileLogger implements Logger {
  log(message: string): void { /* write to file */ }
}
```

## 🔧 Common Implementation Patterns

### Strategy Pattern
```typescript
// Define strategy interface
interface SortStrategy<T> {
  sort(items: T[]): T[];
}

// Implement concrete strategies
class QuickSortStrategy<T> implements SortStrategy<T> {
  sort(items: T[]): T[] { /* quicksort implementation */ }
}

class MergeSortStrategy<T> implements SortStrategy<T> {
  sort(items: T[]): T[] { /* mergesort implementation */ }
}

// Context uses strategy
class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}
  
  sort(items: T[]): T[] {
    return this.strategy.sort(items);
  }
  
  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }
}

// Usage
const sorter = new Sorter(new QuickSortStrategy());
const sorted = sorter.sort(data);
```

### Factory Pattern
```typescript
// Abstract product
interface Database {
  connect(): Promise<void>;
  query(sql: string): Promise<any>;
}

// Concrete products
class PostgreSQL implements Database {
  async connect(): Promise<void> { /* postgres connection */ }
  async query(sql: string): Promise<any> { /* postgres query */ }
}

class MongoDB implements Database {
  async connect(): Promise<void> { /* mongo connection */ }
  async query(sql: string): Promise<any> { /* mongo query */ }
}

// Factory
class DatabaseFactory {
  static create(type: 'postgres' | 'mongo', config: any): Database {
    switch (type) {
      case 'postgres': return new PostgreSQL(config);
      case 'mongo': return new MongoDB(config);
      default: throw new Error(`Unknown database type: ${type}`);
    }
  }
}

// Usage
const db = DatabaseFactory.create('postgres', { host: 'localhost' });
```

### Builder Pattern
```typescript
class APIClientBuilder {
  private baseUrl?: string;
  private timeout?: number;
  private retryStrategy?: RetryStrategy;
  private authStrategy?: AuthStrategy;

  setBaseUrl(url: string): this {
    this.baseUrl = url;
    return this;
  }

  setTimeout(ms: number): this {
    this.timeout = ms;
    return this;
  }

  withRetry(strategy: RetryStrategy): this {
    this.retryStrategy = strategy;
    return this;
  }

  withAuth(strategy: AuthStrategy): this {
    this.authStrategy = strategy;
    return this;
  }

  build(): APIClient {
    if (!this.baseUrl) {
      throw new Error('Base URL is required');
    }

    return new APIClient({
      baseUrl: this.baseUrl,
      timeout: this.timeout ?? 5000,
      retryStrategy: this.retryStrategy ?? new NoRetryStrategy(),
      authStrategy: this.authStrategy ?? new NoAuthStrategy()
    });
  }
}

// Usage with method chaining
const client = new APIClientBuilder()
  .setBaseUrl('https://api.example.com')
  .setTimeout(10000)
  .withRetry(new ExponentialBackoffRetry())
  .withAuth(new BearerTokenAuth('token'))
  .build();
```

### Observer Pattern
```typescript
interface Observer<T> {
  update(data: T): void;
}

interface Subject<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}

class EventEmitter<T> implements Subject<T> {
  private observers: Observer<T>[] = [];

  subscribe(observer: Observer<T>): void {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  notify(data: T): void {
    this.observers.forEach(observer => observer.update(data));
  }
}

// Usage
class UserActivityLogger implements Observer<UserEvent> {
  update(event: UserEvent): void {
    console.log(`User ${event.userId} performed ${event.action}`);
  }
}

const userEvents = new EventEmitter<UserEvent>();
const logger = new UserActivityLogger();
userEvents.subscribe(logger);
```

## 🧪 Testing Patterns

### Dependency Injection for Testing
```typescript
// Production
const userService = new UserService(
  new DatabaseUserRepository(),
  new EmailNotificationService(),
  new ConsoleLogger()
);

// Testing with mocks
const userService = new UserService(
  new MockUserRepository(),
  new MockNotificationService(),
  new MockLogger()
);
```

### Test Factory Pattern
```typescript
class UserTestFactory {
  static createValidUser(overrides: Partial<User> = {}): User {
    return {
      id: 'test-user-1',
      name: 'Test User',
      email: 'test@example.com',
      ...overrides
    };
  }

  static createInvalidUser(): User {
    return {
      id: '',
      name: '',
      email: 'invalid-email'
    };
  }
}

// Usage in tests
describe('UserService', () => {
  it('should create user successfully', async () => {
    const user = UserTestFactory.createValidUser();
    const result = await userService.createUser(user);
    expect(result).toBeDefined();
  });
});
```

### Mock Strategy Pattern
```typescript
class MockRetryStrategy implements RetryStrategy {
  private shouldRetryFlag = true;

  shouldRetry(): boolean {
    return this.shouldRetryFlag;
  }

  getRetryDelay(): number {
    return 0; // No delay in tests
  }

  setReturnValue(value: boolean): void {
    this.shouldRetryFlag = value;
  }
}

// Test with controlled behavior
it('should handle retry logic', async () => {
  const mockRetry = new MockRetryStrategy();
  mockRetry.setReturnValue(false); // Don't retry
  
  const client = new APIClient({ retryStrategy: mockRetry });
  // Test behavior when retries are disabled
});
```

## 🎯 Code Quality Checklist

### Before Committing Code

- [ ] **SRP**: Each class/function has a single responsibility
- [ ] **OCP**: Can extend behavior without modifying existing code
- [ ] **LSP**: All implementations can substitute interfaces
- [ ] **ISP**: Interfaces are focused and minimal
- [ ] **DIP**: Dependencies are injected, not hardcoded
- [ ] **Tests**: Unit tests cover new functionality
- [ ] **Types**: All TypeScript types are properly defined
- [ ] **Errors**: Proper error handling and custom error types
- [ ] **Documentation**: Code is self-documenting or has comments
- [ ] **Performance**: No obvious performance issues

### Code Review Checklist

- [ ] **Architecture**: Follows established patterns
- [ ] **Naming**: Clear, descriptive names
- [ ] **Complexity**: Functions/classes are not too complex
- [ ] **Duplication**: No duplicate code
- [ ] **Security**: No security vulnerabilities
- [ ] **Accessibility**: UI components are accessible
- [ ] **Mobile**: Responsive design considerations
- [ ] **Browser**: Cross-browser compatibility

## 🚨 Common Anti-Patterns to Avoid

### God Classes
```typescript
// ❌ Bad: Does everything
class UserManager {
  validate() { /* ... */ }
  save() { /* ... */ }
  sendEmail() { /* ... */ }
  generateReport() { /* ... */ }
  processPayment() { /* ... */ }
  analyzeData() { /* ... */ }
}

// ✅ Good: Split responsibilities
class UserValidator { /* ... */ }
class UserRepository { /* ... */ }
class UserNotificationService { /* ... */ }
class UserReportService { /* ... */ }
class PaymentService { /* ... */ }
class UserAnalyticsService { /* ... */ }
```

### Tight Coupling
```typescript
// ❌ Bad: Tight coupling
class OrderService {
  processOrder(order: Order) {
    const emailService = new EmailService(); // Hardcoded dependency
    emailService.sendConfirmation(order.customerEmail);
  }
}

// ✅ Good: Loose coupling
class OrderService {
  constructor(private emailService: EmailService) {} // Injected dependency
  
  processOrder(order: Order) {
    this.emailService.sendConfirmation(order.customerEmail);
  }
}
```

### Magic Numbers/Strings
```typescript
// ❌ Bad: Magic values
if (user.status === 1) { /* ... */ }
setTimeout(callback, 5000);

// ✅ Good: Named constants
const USER_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
} as const;

const TIMEOUT_MS = 5000;

if (user.status === USER_STATUS.ACTIVE) { /* ... */ }
setTimeout(callback, TIMEOUT_MS);
```

### Inappropriate Inheritance
```typescript
// ❌ Bad: Inheritance for code reuse
class Rectangle {
  width: number;
  height: number;
  area() { return this.width * this.height; }
}

class Square extends Rectangle {
  // Square is-not-a Rectangle conceptually
}

// ✅ Good: Composition over inheritance
interface Shape {
  area(): number;
}

class Rectangle implements Shape {
  constructor(private width: number, private height: number) {}
  area() { return this.width * this.height; }
}

class Square implements Shape {
  constructor(private side: number) {}
  area() { return this.side * this.side; }
}
```

## 📚 Further Reading

- [Clean Code by Robert Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350884)
- [Design Patterns by Gang of Four](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612)
- [Clean Architecture by Robert Martin](https://www.amazon.com/Clean-Architecture-Craftsmans-Software-Structure/dp/0134494164)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Patterns](https://reactpatterns.com/)

This quick reference should help you maintain consistency with the SOLID principles and patterns established in the project. Keep it handy for daily development tasks!
