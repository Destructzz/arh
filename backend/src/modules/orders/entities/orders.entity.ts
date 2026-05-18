import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-items.entity';
import { Payment } from './payments.entity';

export enum OrderStatus {
  New = 'new',
  Paid = 'paid',
  InAssembly = 'in_assembly',
  Done = 'done',
  Cancelled = 'cancelled',
}

export enum OrderChannel {
  Online = 'online',
  Offline = 'offline',
  Phone = 'phone',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User | null;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string | null;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.New })
  status: OrderStatus;

  @Column({ type: 'enum', enum: OrderChannel })
  channel: OrderChannel;

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
}

