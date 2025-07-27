// Base value objects and common types
export abstract class ValueObject<T> {
  protected readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  public equals(other: ValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }

  public getValue(): T {
    return this.value;
  }
}

// Entity base class
export abstract class Entity<T> {
  protected readonly id: T;

  constructor(id: T) {
    this.id = id;
  }

  public getId(): T {
    return this.id;
  }

  public equals(other: Entity<T>): boolean {
    return this.id === other.id;
  }
}

// Domain events
export interface DomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventType: string;
}

export abstract class AggregateRoot<T> extends Entity<T> {
  private domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  public getDomainEvents(): DomainEvent[] {
    return [...this.domainEvents];
  }

  public clearDomainEvents(): void {
    this.domainEvents = [];
  }
}

// Common exceptions
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Result pattern for error handling
export class Result<T> {
  private constructor(
    private readonly success: boolean,
    private readonly error?: string,
    private readonly value?: T
  ) {}

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public isSuccess(): boolean {
    return this.success;
  }

  public isFailure(): boolean {
    return !this.success;
  }

  public getValue(): T {
    if (!this.success) {
      throw new Error('Cannot get value from failed result');
    }
    return this.value!;
  }

  public getError(): string {
    if (this.success) {
      throw new Error('Cannot get error from successful result');
    }
    return this.error!;
  }
}

// Common types
export type UUID = string;
export type Email = string;
export type Timestamp = Date;
