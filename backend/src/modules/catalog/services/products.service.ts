import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from '../entities/categories.entity';
import { Product } from '../entities/products.entity';

export interface CreateProductDto {
  name: string;
  description?: string | null;
  categoryId?: string | null;
  price: number;
  costPrice?: number;
  isActive?: boolean;
  imageUrl?: string | null;
}

export type UpdateProductDto = Partial<CreateProductDto>;

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  findAll() {
    this.productsRepo.find({
      relations: { category: true, inventoryItem: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepo.findOne({
      where: { id },
      relations: { category: true, inventoryItem: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  create(dto: CreateProductDto): Promise<Product> {
    const product = this.productsRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      category: dto.categoryId ? ({ id: dto.categoryId } as Category) : null,
      price: dto.price,
      costPrice: dto.costPrice ?? 0,
      isActive: dto.isActive ?? true,
      imageUrl: dto.imageUrl ?? null,
    });

    return this.productsRepo.save(product);
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepo.preload({
      id,
      name: dto.name,
      description: dto.description,
      category:
        dto.categoryId === undefined
          ? undefined
          : dto.categoryId
            ? ({ id: dto.categoryId } as Category)
            : null,
      price: dto.price,
      costPrice: dto.costPrice,
      isActive: dto.isActive,
      imageUrl: dto.imageUrl,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productsRepo.save(product);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.productsRepo.delete(id);
    return { deleted: true };
  }
}


