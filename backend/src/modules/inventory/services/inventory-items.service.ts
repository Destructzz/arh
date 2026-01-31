import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../../catalog/entities/products.entity';
import { InventoryItem } from '../entities/inventory-items.entity';

export interface CreateInventoryItemDto {
  productId: string;
  quantityOnHand?: number;
  reserved?: number;
}

export type UpdateInventoryItemDto = Partial<CreateInventoryItemDto>;

@Injectable()
export class InventoryItemsService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,
  ) {}

  findAll(): Promise<InventoryItem[]> {
    return this.inventoryRepo.find({ relations: { product: true } });
  }

  async findOne(id: string): Promise<InventoryItem> {
    const item = await this.inventoryRepo.findOne({
      where: { id },
      relations: { product: true },
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    return item;
  }

  create(dto: CreateInventoryItemDto): Promise<InventoryItem> {
    const item = this.inventoryRepo.create({
      product: { id: dto.productId } as Product,
      quantityOnHand: dto.quantityOnHand ?? 0,
      reserved: dto.reserved ?? 0,
    });

    return this.inventoryRepo.save(item);
  }

  async update(id: string, dto: UpdateInventoryItemDto): Promise<InventoryItem> {
    const item = await this.inventoryRepo.preload({
      id,
      product: dto.productId ? ({ id: dto.productId } as Product) : undefined,
      quantityOnHand: dto.quantityOnHand,
      reserved: dto.reserved,
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    return this.inventoryRepo.save(item);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.inventoryRepo.delete(id);
    return { deleted: true };
  }
}



