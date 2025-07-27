import { Result } from '../../../shared-kernel/src';
import { PartRepository, SearchCriteria } from '../../../parts-domain/src';
import { SearchPartsDTO, SearchPartsResponseDTO, PartDTO } from '../dtos';

export class SearchPartsUseCase {
  constructor(private partRepository: PartRepository) {}

  async execute(dto: SearchPartsDTO): Promise<Result<SearchPartsResponseDTO>> {
    try {
      const criteria: SearchCriteria = {
        name: dto.name,
        partNumber: dto.partNumber,
        category: dto.category,
        status: dto.status,
        minPrice: dto.minPrice,
        maxPrice: dto.maxPrice,
        inStock: dto.inStock,
        page: dto.page || 1,
        limit: dto.limit || 10
      };

      const searchResult = await this.partRepository.search(criteria);
      
      if (searchResult.isFailure()) {
        return Result.fail(searchResult.getError());
      }

      const parts = searchResult.getValue();
      
      // Convert domain entities to DTOs
      const partDtos: PartDTO[] = parts.map(part => ({
        id: part.getId().getValue(),
        partNumber: part.getPartNumber().getValue(),
        name: part.getName().getValue(),
        description: part.getDescription(),
        price: part.getPrice().getValue(),
        quantity: part.getQuantity().getValue(),
        status: part.getStatus(),
        category: part.getCategory().getValue(),
        createdAt: part.getCreatedAt(),
        updatedAt: part.getUpdatedAt()
      }));

      // In a real implementation, you'd get the total count from the repository
      const total = partDtos.length;
      const totalPages = Math.ceil(total / criteria.limit!);

      const response: SearchPartsResponseDTO = {
        parts: partDtos,
        total,
        page: criteria.page!,
        limit: criteria.limit!,
        totalPages
      };

      return Result.ok(response);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
}
