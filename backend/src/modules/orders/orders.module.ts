import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { OrderItemsController } from './controllers/order-items.controller';
import { OrderItem } from './entities/order-items.entity';
import { OrderItemsService } from './services/order-items.service';
import { OrdersController } from './controllers/orders.controller';
import { Order } from './entities/orders.entity';
import { OrdersService } from './services/orders.service';
import { PaymentsController } from './controllers/payments.controller';
import { Payment } from './entities/payments.entity';
import { PaymentsService } from './services/payments.service';
import { InventoryItem } from '../inventory/entities/inventory-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Payment, InventoryItem])],
  controllers: [OrdersController, OrderItemsController, PaymentsController],
  providers: [OrdersService, OrderItemsService, PaymentsService],
})
export class OrdersModule {}


