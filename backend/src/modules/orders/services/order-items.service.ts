import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from '../../catalog/entities/products.entity';
import { Order } from '../entities/orders.entity';
import { OrderItem } from '../entities/order-items.entity';

export interface CreateOrderItemDto {
  orderId: string;
  productId?: string | null;
  qty: number;
  price: number;
  costPrice?: number;
  nameSnapshot: string;
}

export type UpdateOrderItemDto = Partial<CreateOrderItemDto>;

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemsRepo: Repository<OrderItem>,
  ) {}

  findAll(): Promise<OrderItem[]> {
    return this.orderItemsRepo.find({ relations: { order: true, product: true } });
  }

  async findOne(id: string): Promise<OrderItem> {
    const item = await this.orderItemsRepo.findOne({
      where: { id },
      relations: { order: true, product: true },
    });

    if (!item) {
      throw new NotFoundException('Order item not found');
    }

    return item;
  }

  create(dto: CreateOrderItemDto): Promise<OrderItem> {
    const item = this.orderItemsRepo.create({
      order: { id: dto.orderId } as Order,
      product: dto.productId ? ({ id: dto.productId } as Product) : null,
      qty: dto.qty,
      price: dto.price,
      costPrice: dto.costPrice ?? 0,
      nameSnapshot: dto.nameSnapshot,
    });

    return this.orderItemsRepo.save(item);
  }

  async update(id: string, dto: UpdateOrderItemDto): Promise<OrderItem> {
    const item = await this.orderItemsRepo.preload({
      id,
      order: dto.orderId ? ({ id: dto.orderId } as Order) : undefined,
      product: dto.productId ? ({ id: dto.productId } as Product) : undefined,
      qty: dto.qty,
      price: dto.price,
      costPrice: dto.costPrice,
      nameSnapshot: dto.nameSnapshot,
    });

    if (!item) {
      throw new NotFoundException('Order item not found');
    }

    return this.orderItemsRepo.save(item);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.orderItemsRepo.delete(id);
    return { deleted: true };
  }
}



