import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../../catalog/entities/products.entity';
import { Order } from './orders.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  product?: Product | null;

  @Column({ type: 'int' })
  qty: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ name: 'cost_price', type: 'float', default: 0 })
  costPrice: number;

  @Column({ name: 'name_snapshot', length: 200 })
  nameSnapshot: string;
}

