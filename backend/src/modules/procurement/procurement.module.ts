import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PurchaseItemsController } from './controllers/purchase-items.controller';
import { PurchaseItem } from './entities/purchase-items.entity';
import { PurchaseItemsService } from './services/purchase-items.service';
import { PurchaseOrdersController } from './controllers/purchase-orders.controller';
import { PurchaseOrder } from './entities/purchase-orders.entity';
import { PurchaseOrdersService } from './services/purchase-orders.service';
import { SuppliersController } from './controllers/suppliers.controller';
import { Supplier } from './entities/suppliers.entity';
import { SuppliersService } from './services/suppliers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, PurchaseOrder, PurchaseItem])],
  controllers: [SuppliersController, PurchaseOrdersController, PurchaseItemsController],
  providers: [SuppliersService, PurchaseOrdersService, PurchaseItemsService],
})
export class ProcurementModule {}


