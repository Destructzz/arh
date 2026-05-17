import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoriesController } from './controllers/categories.controller';
import { Category } from './entities/categories.entity';
import { CategoriesService } from './services/categories.service';
import { ProductsController } from './controllers/products.controller';
import { SeedController } from './controllers/seed.controller';
import { Product } from './entities/products.entity';
import { ProductsService } from './services/products.service';
import { InventoryItem } from '../inventory/entities/inventory-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, InventoryItem])],
  controllers: [CategoriesController, ProductsController, SeedController],
  providers: [CategoriesService, ProductsService],
})
export class CatalogModule { }


