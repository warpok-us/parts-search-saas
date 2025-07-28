// Core domain types - single source of truth
export interface PartDTO {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: 'ACTIVE' | 'INACTIVE' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SearchPartsDTO {
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

export interface SearchPartsResponseDTO {
  parts: PartDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePartDTO {
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
}

export interface UpdatePartDTO {
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  category?: string;
}

// API Configuration Types
export interface PartsAPIConfig {
  baseUrl: string;
  apiKey?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

// Common utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type NonEmptyArray<T> = [T, ...T[]];

export type Awaitable<T> = T | Promise<T>;

export type Nullable<T> = T | null;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
