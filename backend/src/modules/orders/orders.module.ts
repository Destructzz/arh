import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeliveriesController } from './controllers/deliveries.controller';
import { Delivery } from './entities/deliveries.entity';
import { DeliveriesService } from './services/deliveries.service';
import { OrderItemsController } from './controllers/order-items.controller';
import { OrderItem } from './entities/order-items.entity';
import { OrderItemsService } from './services/order-items.service';
import { OrdersController } from './controllers/orders.controller';
import { Order } from './entities/orders.entity';
import { OrdersService } from './services/orders.service';
import { PaymentsController } from './controllers/payments.controller';
import { Payment } from './entities/payments.entity';
import { PaymentsService } from './services/payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Payment, Delivery])],
  controllers: [OrdersController, OrderItemsController, PaymentsController, DeliveriesController],
  providers: [OrdersService, OrderItemsService, PaymentsService, DeliveriesService],
})
export class OrdersModule {}


