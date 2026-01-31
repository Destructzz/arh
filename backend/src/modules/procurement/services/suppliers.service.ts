import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Supplier } from '../entities/suppliers.entity';

export interface CreateSupplierDto {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export type UpdateSupplierDto = Partial<CreateSupplierDto>;

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliersRepo: Repository<Supplier>,
  ) {}

  findAll(): Promise<Supplier[]> {
    return this.suppliersRepo.find();
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.suppliersRepo.findOne({ where: { id } });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return supplier;
  }

  create(dto: CreateSupplierDto): Promise<Supplier> {
    const supplier = this.suppliersRepo.create({
      name: dto.name,
      phone: dto.phone ?? null,
      email: dto.email ?? null,
      address: dto.address ?? null,
    });

    return this.suppliersRepo.save(supplier);
  }

  async update(id: string, dto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.suppliersRepo.preload({
      id,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
    });

    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }

    return this.suppliersRepo.save(supplier);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.suppliersRepo.delete(id);
    return { deleted: true };
  }
}


