import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';

import { Category } from '../entities/categories.entity';

export interface CreateCategoryDto {
  name: string;
  parentId?: string | null;
}

export type UpdateCategoryDto = Partial<CreateCategoryDto>;

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepo: Repository<Category>,
  ) {}

  findAll(): Promise<Category[]> {
    return this.categoriesRepo.find({
      relations: { parent: true, children: true },
      order: { name: 'ASC' },
    });
  }

  async getFeatured(): Promise<Category[]> {
    const all = await this.categoriesRepo.find({ order: { name: 'ASC' } });
    if (all.length <= 3) return all;

    // Deterministic random: changes every hour
    const seed = Math.floor(Date.now() / 3_600_000);
    const shuffled = [...all].sort((a, b) => {
      const ha = Math.sin(seed + a.id.charCodeAt(0)) * 10000;
      const hb = Math.sin(seed + b.id.charCodeAt(0)) * 10000;
      return (ha - Math.floor(ha)) - (hb - Math.floor(hb));
    });
    return shuffled.slice(0, 3);
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepo.findOne({
      where: { id },
      relations: { parent: true, children: true },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepo.create({
      name: dto.name,
      parent: dto.parentId ? ({ id: dto.parentId } as Category) : null,
    });

    try {
      return await this.categoriesRepo.save(category);
    } catch (error) {
      if (error instanceof QueryFailedError && (error as { code?: string }).code === '23505') {
        throw new ConflictException('Category with this name already exists');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoriesRepo.preload({
      id,
      name: dto.name,
      parent:
        dto.parentId === undefined
          ? undefined
          : dto.parentId
            ? ({ id: dto.parentId } as Category)
            : null,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.categoriesRepo.save(category);
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.categoriesRepo.delete(id);
    return { deleted: true };
  }
}


