import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../../customers/entities/customers.entity';
import { DeliveryType, Order, OrderChannel, OrderStatus } from '../entities/orders.entity';

export interface CreateOrderDto {
  customerId?: string | null;
  status?: OrderStatus;
  channel: OrderChannel;
  deliveryType: DeliveryType;
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
  ) {}

  findAll(): Promise<Order[]> {
    return this.ordersRepo.find({
      relations: { customer: true, items: { product: true }, payments: true, delivery: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.ordersRepo.findOne({
      where: { id },
      relations: { customer: true, items: { product: true }, payments: true, delivery: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  create(dto: CreateOrderDto): Promise<Order> {
    const order = this.ordersRepo.create({
      customer: dto.customerId ? ({ id: dto.customerId } as Customer) : null,
      status: dto.status ?? OrderStatus.New,
      channel: dto.channel,
      deliveryType: dto.deliveryType,
      totalPrice: dto.totalPrice ?? 0,
      totalCost: dto.totalCost ?? 0,
      discountAmount: dto.discountAmount ?? 0,
    });

    return this.ordersRepo.save(order);
  }

  async update(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepo.preload({
      id,
      customer:
        dto.customerId === undefined
          ? undefined
          : dto.customerId
            ? ({ id: dto.customerId } as Customer)
            : null,
      status: dto.status,
      channel: dto.channel,
      deliveryType: dto.deliveryType,
      totalPrice: dto.totalPrice,
      totalCost: dto.totalCost,
      discountAmount: dto.discountAmount,
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.ordersRepo.save(order);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.ordersRepo.delete(id);
    return { deleted: true };
  }
}



