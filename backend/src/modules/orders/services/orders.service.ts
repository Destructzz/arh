import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderChannel, OrderStatus } from '../entities/orders.entity';
import { InventoryItem } from '../../inventory/entities/inventory-items.entity';

export interface CreateOrderDto {
  userId?: string | null;
  status?: OrderStatus;
  channel: OrderChannel;
  totalPrice?: number;
  totalCost?: number;
  discountAmount?: number;
}

export type UpdateOrderDto = Partial<CreateOrderDto>;

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepo: Repository<Order>,
    @InjectRepository(InventoryItem)
    private readonly inventoryItemRepo: Repository<InventoryItem>,
  ) { }

  findAll(): Promise<Order[]> {
    return this.ordersRepo.find({
      relations: { items: { product: true }, payments: true },
      order: { createdAt: 'DESC' },
    });
  }

  findMyOrders(userId: string): Promise<Order[]> {
    return this.ordersRepo.find({
      where: { userId },
      relations: { items: { product: true }, payments: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: { items: { product: true }, payments: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  create(dto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepo.create({
      userId: dto.userId ?? null,
      status: dto.status ?? OrderStatus.New,
      channel: dto.channel,
      totalPrice: dto.totalPrice ?? 0,
      totalCost: dto.totalCost ?? 0,
      discountAmount: dto.discountAmount ?? 0,
    });

    return this.ordersRepo.save(order);
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const existingOrder = await this.ordersRepo.findOne({
      where: { id },
      relations: { items: { product: true } },
    });

    if (!existingOrder) {
      throw new NotFoundException('Order not found');
    }

    const activeStatuses = [OrderStatus.New, OrderStatus.Paid, OrderStatus.InAssembly];
    const isPreviousActive = activeStatuses.includes(existingOrder.status);

    if (isPreviousActive && dto.status) {
      if (dto.status === OrderStatus.Cancelled) {
        // Release reservation
        for (const item of existingOrder.items || []) {
          if (item.product) {
            const invItem = await this.inventoryItemRepo.findOne({
              where: { product: { id: item.product.id } },
            });
            if (invItem) {
              invItem.reserved = Math.max(0, invItem.reserved - item.qty);
              await this.inventoryItemRepo.save(invItem);
            }
          }
        }
      } else if (dto.status === OrderStatus.Done) {
        // Deduct from stock and release reservation
        for (const item of existingOrder.items || []) {
          if (item.product) {
            const invItem = await this.inventoryItemRepo.findOne({
              where: { product: { id: item.product.id } },
            });
            if (invItem) {
              invItem.quantityOnHand = Math.max(0, invItem.quantityOnHand - item.qty);
              invItem.reserved = Math.max(0, invItem.reserved - item.qty);
              await this.inventoryItemRepo.save(invItem);
            }
          }
        }
      }
    }

    const preloadedOrder = await this.ordersRepo.preload({
      id,
      userId: dto.userId,
      status: dto.status,
      channel: dto.channel,
      totalPrice: dto.totalPrice,
      totalCost: dto.totalCost,
      discountAmount: dto.discountAmount,
    });

    if (!preloadedOrder) {
      throw new NotFoundException('Order not found');
    }

    return this.ordersRepo.save(preloadedOrder);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    const existingOrder = await this.ordersRepo.findOne({
      where: { id },
      relations: { items: { product: true } },
    });
    if (existingOrder) {
      const activeStatuses = [OrderStatus.New, OrderStatus.Paid, OrderStatus.InAssembly];
      if (activeStatuses.includes(existingOrder.status)) {
        // Release reservation
        for (const item of existingOrder.items || []) {
          if (item.product) {
            const invItem = await this.inventoryItemRepo.findOne({
              where: { product: { id: item.product.id } },
            });
            if (invItem) {
              invItem.reserved = Math.max(0, invItem.reserved - item.qty);
              await this.inventoryItemRepo.save(invItem);
            }
          }
        }
      }
    }
    await this.ordersRepo.delete(id);
    return { deleted: true };
  }
}



