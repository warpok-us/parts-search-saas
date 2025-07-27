import { Result } from '../../../shared-kernel/src';
import { 
  Part, 
  PartRepository, 
  PartNumber, 
  PartName, 
  Price, 
  Quantity, 
  Category, 
  PartStatus 
} from '../../../parts-domain/src';
import { CreatePartDTO, PartDTO } from '../dtos';

export class CreatePartUseCase {
  constructor(private partRepository: PartRepository) {}

  async execute(dto: CreatePartDTO): Promise<Result<PartDTO>> {
    try {
      // Check if part number already exists
      const partNumber = new PartNumber(dto.partNumber);
      const existsResult = await this.partRepository.exists(partNumber);
      
      if (existsResult.isFailure()) {
        return Result.fail(existsResult.getError());
      }

      if (existsResult.getValue()) {
        return Result.fail('Part with this part number already exists');
      }

      // Create the part
      const part = Part.create({
        partNumber,
        name: new PartName(dto.name),
        description: dto.description,
        price: new Price(dto.price),
        quantity: new Quantity(dto.quantity),
        status: PartStatus.ACTIVE,
        category: new Category(dto.category)
      });

      // Save the part
      const saveResult = await this.partRepository.save(part);
      if (saveResult.isFailure()) {
        return Result.fail(saveResult.getError());
      }

      // Return the created part as DTO
      const partDto: PartDTO = {
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
      };

      return Result.ok(partDto);
    } catch (error) {
      return Result.fail(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
}
