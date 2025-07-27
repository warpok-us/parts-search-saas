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
