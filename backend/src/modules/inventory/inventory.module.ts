import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InventoryItemsController } from './controllers/inventory-items.controller';
import { InventoryItemsService } from './services/inventory-items.service';
import { InventoryItem } from './entities/inventory-items.entity';
import { StockMovementsController } from './controllers/stock-movements.controller';
import { StockMovementsService } from './services/stock-movements.service';
import { StockMovement } from './entities/stock-movements.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, StockMovement])],
  controllers: [InventoryItemsController, StockMovementsController],
  providers: [InventoryItemsService, StockMovementsService],
})
export class InventoryModule {}


