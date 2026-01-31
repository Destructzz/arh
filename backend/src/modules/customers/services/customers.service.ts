import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../entities/customers.entity';

export interface CreateCustomerDto {
  name: string;
  phone?: string | null;
  email?: string | null;
  birthday?: string | null;
  notes?: string | null;
}

export type UpdateCustomerDto = Partial<CreateCustomerDto>;

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customersRepo: Repository<Customer>,
  ) {}

  findAll(): Promise<Customer[]> {
    return this.customersRepo.find({ relations: { loyaltyAccount: true } });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepo.findOne({
      where: { id },
      relations: { loyaltyAccount: true },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  create(dto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customersRepo.create({
      name: dto.name,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      birthday: dto.birthday ?? null,
      notes: dto.notes ?? null,
    });

    return this.customersRepo.save(customer);
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    const customer = await this.customersRepo.preload({
      id,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      birthday: dto.birthday,
      notes: dto.notes,
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return this.customersRepo.save(customer);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.customersRepo.delete(id);
    return { deleted: true };
  }
}


