import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './entities/cart-items.entity';
import { Order } from '../orders/entities/orders.entity';
import { OrderItem } from '../orders/entities/order-items.entity';
import { InventoryItem } from '../inventory/entities/inventory-items.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, Order, OrderItem, InventoryItem])],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule { }
