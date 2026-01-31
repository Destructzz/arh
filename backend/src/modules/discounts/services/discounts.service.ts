import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Discount, DiscountType } from '../entities/discounts.entity';

export interface CreateDiscountDto {
  code: string;
  type: DiscountType;
  value: number;
  startsAt?: string | null;
  endsAt?: string | null;
  isActive?: boolean;
}

export type UpdateDiscountDto = Partial<CreateDiscountDto>;

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountsRepo: Repository<Discount>,
  ) {}

  findAll(): Promise<Discount[]> {
    return this.discountsRepo.find();
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountsRepo.findOne({ where: { id } });

    if (!discount) {
      throw new NotFoundException('Discount not found');
    }

    return discount;
  }

  create(dto: CreateDiscountDto): Promise<Discount> {
    const discount = this.discountsRepo.create({
      code: dto.code,
      type: dto.type,
      value: dto.value,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : null,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : null,
      isActive: dto.isActive ?? true,
    });

    return this.discountsRepo.save(discount);
  }

  async update(id: string, dto: UpdateDiscountDto): Promise<Discount> {
    const discount = await this.discountsRepo.preload({
      id,
      code: dto.code,
      type: dto.type,
      value: dto.value,
      startsAt: dto.startsAt ? new Date(dto.startsAt) : undefined,
      endsAt: dto.endsAt ? new Date(dto.endsAt) : undefined,
      isActive: dto.isActive,
    });

    if (!discount) {
      throw new NotFoundException('Discount not found');
    }

    return this.discountsRepo.save(discount);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.discountsRepo.delete(id);
    return { deleted: true };
  }
}


