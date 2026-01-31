import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Customer } from '../../customers/entities/customers.entity';
import { Delivery } from './deliveries.entity';
import { OrderItem } from './order-items.entity';
import { Payment } from './payments.entity';

export enum OrderStatus {
  New = 'new',
  Paid = 'paid',
  InAssembly = 'in_assembly',
  OutForDelivery = 'out_for_delivery',
  Done = 'done',
  Cancelled = 'cancelled',
}

export enum OrderChannel {
  Online = 'online',
  Offline = 'offline',
  Phone = 'phone',
}

export enum DeliveryType {
  Courier = 'courier',
  Pickup = 'pickup',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  customer?: Customer | null;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.New })
  status: OrderStatus;

  @Column({ type: 'enum', enum: OrderChannel })
  channel: OrderChannel;

  @Column({ name: 'delivery_type', type: 'enum', enum: DeliveryType })
  deliveryType: DeliveryType;

  @Column({ name: 'total_price', type: 'float', default: 0 })
  totalPrice: number;

  @Column({ name: 'total_cost', type: 'float', default: 0 })
  totalCost: number;

  @Column({ name: 'discount_amount', type: 'float', default: 0 })
  discountAmount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => OrderItem, (item) => item.order)
  items?: OrderItem[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments?: Payment[];

  @OneToOne(() => Delivery, (delivery) => delivery.order)
  delivery?: Delivery | null;
}

