import { AggregateRoot, DomainEvent } from '../../../shared-kernel/src';
import { 
  PartId, 
  PartNumber, 
  PartName, 
  Price, 
  Quantity, 
  PartStatus, 
  Category 
} from '../value-objects';

export interface PartCreatedEvent extends DomainEvent {
  eventType: 'PartCreated';
  partId: string;
  partNumber: string;
  name: string;
}

export interface PartUpdatedEvent extends DomainEvent {
  eventType: 'PartUpdated';
  partId: string;
  changes: Record<string, unknown>;
}

export interface PartProps {
  partNumber: PartNumber;
  name: PartName;
  description?: string;
  price: Price;
  quantity: Quantity;
  status: PartStatus;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export class Part extends AggregateRoot<PartId> {
  private constructor(
    id: PartId,
    private props: PartProps
  ) {
    super(id);
  }

  public static create(props: Omit<PartProps, 'createdAt' | 'updatedAt'>): Part {
    const id = PartId.generate();
    const now = new Date();
    
    const part = new Part(id, {
      ...props,
      createdAt: now,
      updatedAt: now
    });

    const event: PartCreatedEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'PartCreated',
      occurredOn: now,
      partId: id.getValue(),
      partNumber: props.partNumber.getValue(),
      name: props.name.getValue()
    };

    part.addDomainEvent(event);
    return part;
  }

  public static fromPersistence(id: PartId, props: PartProps): Part {
    return new Part(id, props);
  }

  // Getters
  public getPartNumber(): PartNumber {
    return this.props.partNumber;
  }

  public getName(): PartName {
    return this.props.name;
  }

  public getDescription(): string | undefined {
    return this.props.description;
  }

  public getPrice(): Price {
    return this.props.price;
  }

  public getQuantity(): Quantity {
    return this.props.quantity;
  }

  public getStatus(): PartStatus {
    return this.props.status;
  }

  public getCategory(): Category {
    return this.props.category;
  }

  public getCreatedAt(): Date {
    return this.props.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.props.updatedAt;
  }

  // Business methods
  public updatePrice(newPrice: Price): void {
    const oldPrice = this.props.price.getValue();
    this.props.price = newPrice;
    this.props.updatedAt = new Date();

    const event: PartUpdatedEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'PartUpdated',
      occurredOn: new Date(),
      partId: this.getId().getValue(),
      changes: { price: { from: oldPrice, to: newPrice.getValue() } }
    };

    this.addDomainEvent(event);
  }

  public updateQuantity(newQuantity: Quantity): void {
    const oldQuantity = this.props.quantity.getValue();
    this.props.quantity = newQuantity;
    this.props.updatedAt = new Date();

    const event: PartUpdatedEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'PartUpdated',
      occurredOn: new Date(),
      partId: this.getId().getValue(),
      changes: { quantity: { from: oldQuantity, to: newQuantity.getValue() } }
    };

    this.addDomainEvent(event);
  }

  public changeStatus(newStatus: PartStatus): void {
    const oldStatus = this.props.status;
    this.props.status = newStatus;
    this.props.updatedAt = new Date();

    const event: PartUpdatedEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'PartUpdated',
      occurredOn: new Date(),
      partId: this.getId().getValue(),
      changes: { status: { from: oldStatus, to: newStatus } }
    };

    this.addDomainEvent(event);
  }

  public updateDescription(description: string): void {
    const oldDescription = this.props.description;
    this.props.description = description;
    this.props.updatedAt = new Date();

    const event: PartUpdatedEvent = {
      eventId: crypto.randomUUID(),
      eventType: 'PartUpdated',
      occurredOn: new Date(),
      partId: this.getId().getValue(),
      changes: { description: { from: oldDescription, to: description } }
    };

    this.addDomainEvent(event);
  }

  public isActive(): boolean {
    return this.props.status === PartStatus.ACTIVE;
  }

  public isInStock(): boolean {
    return this.props.quantity.getValue() > 0;
  }
}
