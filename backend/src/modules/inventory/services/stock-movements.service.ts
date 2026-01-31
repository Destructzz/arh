import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../../catalog/entities/products.entity';
import {
  StockMovement,
  StockMovementReason,
  StockMovementType,
} from '../entities/stock-movements.entity';

export interface CreateStockMovementDto {
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: StockMovementReason;
  referenceType?: string | null;
  referenceId?: string | null;
}

export type UpdateStockMovementDto = Partial<CreateStockMovementDto>;

@Injectable()
export class StockMovementsService {
  constructor(
    @InjectRepository(StockMovement)
    private readonly movementsRepo: Repository<StockMovement>,
  ) {}

  findAll(): Promise<StockMovement[]> {
    return this.movementsRepo.find({ relations: { product: true } });
  }

  async findOne(id: string): Promise<StockMovement> {
    const movement = await this.movementsRepo.findOne({
      where: { id },
      relations: { product: true },
    });

    if (!movement) {
      throw new NotFoundException('Stock movement not found');
    }

    return movement;
  }

  create(dto: CreateStockMovementDto): Promise<StockMovement> {
    const movement = this.movementsRepo.create({
      product: { id: dto.productId } as Product,
      type: dto.type,
      quantity: dto.quantity,
      reason: dto.reason,
      referenceType: dto.referenceType ?? null,
      referenceId: dto.referenceId ?? null,
    });

    return this.movementsRepo.save(movement);
  }

  async update(id: string, dto: UpdateStockMovementDto): Promise<StockMovement> {
    const movement = await this.movementsRepo.preload({
      id,
      product: dto.productId ? ({ id: dto.productId } as Product) : undefined,
      type: dto.type,
      quantity: dto.quantity,
      reason: dto.reason,
      referenceType: dto.referenceType,
      referenceId: dto.referenceId,
    });

    if (!movement) {
      throw new NotFoundException('Stock movement not found');
    }

    return this.movementsRepo.save(movement);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.movementsRepo.delete(id);
    return { deleted: true };
  }
}



