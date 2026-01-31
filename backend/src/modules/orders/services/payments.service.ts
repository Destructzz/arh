import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from '../entities/orders.entity';
import { Payment, PaymentMethod, PaymentStatus } from '../entities/payments.entity';

export interface CreatePaymentDto {
  orderId: string;
  method: PaymentMethod;
  amount: number;
  status?: PaymentStatus;
  paidAt?: string | null;
}

export type UpdatePaymentDto = Partial<CreatePaymentDto>;

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepo: Repository<Payment>,
  ) {}

  findAll(): Promise<Payment[]> {
    return this.paymentsRepo.find({ relations: { order: true } });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentsRepo.findOne({
      where: { id },
      relations: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  create(dto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentsRepo.create({
      order: { id: dto.orderId } as Order,
      method: dto.method,
      amount: dto.amount,
      status: dto.status ?? PaymentStatus.Pending,
      paidAt: dto.paidAt ? new Date(dto.paidAt) : null,
    });

    return this.paymentsRepo.save(payment);
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.paymentsRepo.preload({
      id,
      order: dto.orderId ? ({ id: dto.orderId } as Order) : undefined,
      method: dto.method,
      amount: dto.amount,
      status: dto.status,
      paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.paymentsRepo.save(payment);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.paymentsRepo.delete(id);
    return { deleted: true };
  }
}


