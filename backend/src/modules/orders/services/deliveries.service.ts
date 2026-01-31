import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Delivery, DeliveryStatus } from '../entities/deliveries.entity';
import { Order } from '../entities/orders.entity';

export interface CreateDeliveryDto {
  orderId: string;
  address: string;
  deliveryTimeFrom?: string | null;
  deliveryTimeTo?: string | null;
  courierId?: string | null;
  status?: DeliveryStatus;
}

export type UpdateDeliveryDto = Partial<CreateDeliveryDto>;

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveriesRepo: Repository<Delivery>,
  ) {}

  findAll(): Promise<Delivery[]> {
    return this.deliveriesRepo.find({ relations: { order: true } });
  }

  async findOne(id: string): Promise<Delivery> {
    const delivery = await this.deliveriesRepo.findOne({
      where: { id },
      relations: { order: true },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return delivery;
  }

  create(dto: CreateDeliveryDto): Promise<Delivery> {
    const delivery = this.deliveriesRepo.create({
      order: { id: dto.orderId } as Order,
      address: dto.address,
      deliveryTimeFrom: dto.deliveryTimeFrom ? new Date(dto.deliveryTimeFrom) : null,
      deliveryTimeTo: dto.deliveryTimeTo ? new Date(dto.deliveryTimeTo) : null,
      courierId: dto.courierId ?? null,
      status: dto.status ?? DeliveryStatus.Pending,
    });

    return this.deliveriesRepo.save(delivery);
  }

  async update(id: string, dto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.deliveriesRepo.preload({
      id,
      order: dto.orderId ? ({ id: dto.orderId } as Order) : undefined,
      address: dto.address,
      deliveryTimeFrom: dto.deliveryTimeFrom ? new Date(dto.deliveryTimeFrom) : undefined,
      deliveryTimeTo: dto.deliveryTimeTo ? new Date(dto.deliveryTimeTo) : undefined,
      courierId: dto.courierId,
      status: dto.status,
    });

    if (!delivery) {
      throw new NotFoundException('Delivery not found');
    }

    return this.deliveriesRepo.save(delivery);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.deliveriesRepo.delete(id);
    return { deleted: true };
  }
}


