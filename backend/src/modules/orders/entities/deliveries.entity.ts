import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Order } from './orders.entity';

export enum DeliveryStatus {
  Pending = 'pending',
  InTransit = 'in_transit',
  Delivered = 'delivered',
}

@Entity('deliveries')
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.delivery, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'text' })
  address: string;

  @Column({ name: 'delivery_time_from', type: 'timestamp', nullable: true })
  deliveryTimeFrom?: Date | null;

  @Column({ name: 'delivery_time_to', type: 'timestamp', nullable: true })
  deliveryTimeTo?: Date | null;

  @Column({ name: 'courier_id', type: 'varchar', length: 120, nullable: true })
  courierId?: string | null;

  @Column({ type: 'enum', enum: DeliveryStatus, default: DeliveryStatus.Pending })
  status: DeliveryStatus;
}
