import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../../catalog/entities/products.entity';
import { PurchaseItem } from '../entities/purchase-items.entity';
import { PurchaseOrder } from '../entities/purchase-orders.entity';

export interface CreatePurchaseItemDto {
  purchaseOrderId: string;
  productId?: string | null;
  qty: number;
  unitCost?: number;
}

export type UpdatePurchaseItemDto = Partial<CreatePurchaseItemDto>;

@Injectable()
export class PurchaseItemsService {
  constructor(
    @InjectRepository(PurchaseItem)
    private readonly purchaseItemsRepo: Repository<PurchaseItem>,
  ) {}

  findAll(): Promise<PurchaseItem[]> {
    return this.purchaseItemsRepo.find({ relations: { purchaseOrder: true, product: true } });
  }

  async findOne(id: string): Promise<PurchaseItem> {
    const item = await this.purchaseItemsRepo.findOne({
      where: { id },
      relations: { purchaseOrder: true, product: true },
    });

    if (!item) {
      throw new NotFoundException('Purchase item not found');
    }

    return item;
  }

  create(dto: CreatePurchaseItemDto): Promise<PurchaseItem> {
    const item = this.purchaseItemsRepo.create({
      purchaseOrder: { id: dto.purchaseOrderId } as PurchaseOrder,
      product: dto.productId ? ({ id: dto.productId } as Product) : null,
      qty: dto.qty,
      unitCost: dto.unitCost ?? 0,
    });

    return this.purchaseItemsRepo.save(item);
  }

  async update(id: string, dto: UpdatePurchaseItemDto): Promise<PurchaseItem> {
    const item = await this.purchaseItemsRepo.preload({
      id,
      purchaseOrder: dto.purchaseOrderId
        ? ({ id: dto.purchaseOrderId } as PurchaseOrder)
        : undefined,
      product: dto.productId ? ({ id: dto.productId } as Product) : undefined,
      qty: dto.qty,
      unitCost: dto.unitCost,
    });

    if (!item) {
      throw new NotFoundException('Purchase item not found');
    }

    return this.purchaseItemsRepo.save(item);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.purchaseItemsRepo.delete(id);
    return { deleted: true };
  }
}



