// HTTP Client Abstractions for Dependency Inversion
export interface HttpClient {
  request<T>(options: HttpRequestOptions): Promise<HttpResponse<T>>;
}

export interface HttpRequestOptions {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  signal?: AbortSignal;
}

export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Retry Strategy Abstraction
export interface RetryStrategy {
  shouldRetry(attempt: number, error: Error): boolean;
  getRetryDelay(attempt: number): number;
  getMaxAttempts(): number;
}

// Authentication Strategy Abstraction
export interface AuthenticationStrategy {
  authenticate(headers: Record<string, string>): Record<string, string>;
}

// Data Transformer Abstraction
export interface DataTransformer<TInput = unknown, TOutput = unknown> {
  transform(data: TInput): TOutput;
}

// Parts API Client Interface Segregation
export interface PartsReader {
  searchParts(dto: SearchPartsDTO): Promise<SearchPartsResponseDTO>;
  getPartById(id: string): Promise<PartDTO>;
}

export interface PartsWriter {
  createPart(dto: CreatePartDTO): Promise<PartDTO>;
  updatePart(id: string, dto: Partial<CreatePartDTO>): Promise<PartDTO>;
  deletePart(id: string): Promise<void>;
}

export interface PartsAPIClient extends PartsReader, PartsWriter {}

// Forward declarations - will import from index.ts
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

export interface PartDTO {
  id: string;
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  status: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePartDTO {
  partNumber: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category: string;
}

export interface SearchPartsResponseDTO {
  parts: PartDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
