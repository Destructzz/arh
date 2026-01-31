import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from '../entities/suppliers.entity';
import { PurchaseOrder, PurchaseOrderStatus } from '../entities/purchase-orders.entity';

export interface CreatePurchaseOrderDto {
  supplierId?: string | null;
  status?: PurchaseOrderStatus;
  totalCost?: number;
}

export type UpdatePurchaseOrderDto = Partial<CreatePurchaseOrderDto>;

@Injectable()
export class PurchaseOrdersService {
  constructor(
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrdersRepo: Repository<PurchaseOrder>,
  ) {}

  findAll(): Promise<PurchaseOrder[]> {
    return this.purchaseOrdersRepo.find({
      relations: { supplier: true, items: { product: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PurchaseOrder> {
    const order = await this.purchaseOrdersRepo.findOne({
      where: { id },
      relations: { supplier: true, items: { product: true } },
    });

    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    return order;
  }

  create(dto: CreatePurchaseOrderDto): Promise<PurchaseOrder> {
    const order = this.purchaseOrdersRepo.create({
      supplier: dto.supplierId ? ({ id: dto.supplierId } as Supplier) : null,
      status: dto.status ?? PurchaseOrderStatus.Draft,
      totalCost: dto.totalCost ?? 0,
    });

    return this.purchaseOrdersRepo.save(order);
  }

  async update(id: string, dto: UpdatePurchaseOrderDto): Promise<PurchaseOrder> {
    const order = await this.purchaseOrdersRepo.preload({
      id,
      supplier:
        dto.supplierId === undefined
          ? undefined
          : dto.supplierId
            ? ({ id: dto.supplierId } as Supplier)
            : null,
      status: dto.status,
      totalCost: dto.totalCost,
    });

    if (!order) {
      throw new NotFoundException('Purchase order not found');
    }

    return this.purchaseOrdersRepo.save(order);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.purchaseOrdersRepo.delete(id);
    return { deleted: true };
  }
}


