import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../entities/customers.entity';
import { LoyaltyAccount } from '../entities/loyalty-accounts.entity';

export interface CreateLoyaltyAccountDto {
  customerId: string;
  points?: number;
  level?: string;
}

export type UpdateLoyaltyAccountDto = Partial<CreateLoyaltyAccountDto>;

@Injectable()
export class LoyaltyAccountsService {
  constructor(
    @InjectRepository(LoyaltyAccount)
    private readonly loyaltyRepo: Repository<LoyaltyAccount>,
  ) {}

  findAll(): Promise<LoyaltyAccount[]> {
    return this.loyaltyRepo.find({ relations: { customer: true } });
  }

  async findOne(id: string): Promise<LoyaltyAccount> {
    const account = await this.loyaltyRepo.findOne({
      where: { id },
      relations: { customer: true },
    });

    if (!account) {
      throw new NotFoundException('Loyalty account not found');
    }

    return account;
  }

  create(dto: CreateLoyaltyAccountDto): Promise<LoyaltyAccount> {
    const account = this.loyaltyRepo.create({
      customer: { id: dto.customerId } as Customer,
      points: dto.points ?? 0,
      level: dto.level ?? 'base',
    });

    return this.loyaltyRepo.save(account);
  }

  async update(id: string, dto: UpdateLoyaltyAccountDto): Promise<LoyaltyAccount> {
    const account = await this.loyaltyRepo.preload({
      id,
      customer: dto.customerId ? ({ id: dto.customerId } as Customer) : undefined,
      points: dto.points,
      level: dto.level,
    });

    if (!account) {
      throw new NotFoundException('Loyalty account not found');
    }

    return this.loyaltyRepo.save(account);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.loyaltyRepo.delete(id);
    return { deleted: true };
  }
}


