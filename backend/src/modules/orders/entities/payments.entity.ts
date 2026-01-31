import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './orders.entity';

export enum PaymentMethod {
  Cash = 'cash',
  Card = 'card',
  Online = 'online',
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Refunded = 'refunded',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.payments, { onDelete: 'CASCADE' })
  order: Order;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'float' })
  amount: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.Pending })
  status: PaymentStatus;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt?: Date | null;
}
