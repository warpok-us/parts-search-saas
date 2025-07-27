import { Result } from '../../../shared-kernel/src';
import { Part } from '../entities/Part';
import { PartId, PartNumber } from '../value-objects';

export interface SearchCriteria {
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

export interface PartRepository {
  save(part: Part): Promise<Result<void>>;
  findById(id: PartId): Promise<Result<Part | null>>;
  findByPartNumber(partNumber: PartNumber): Promise<Result<Part | null>>;
  search(criteria: SearchCriteria): Promise<Result<Part[]>>;
  delete(id: PartId): Promise<Result<void>>;
  exists(partNumber: PartNumber): Promise<Result<boolean>>;
}
