import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PurchaseItem } from './purchase-items.entity';
import { Supplier } from './suppliers.entity';

export enum PurchaseOrderStatus {
  Draft = 'draft',
  Ordered = 'ordered',
  Received = 'received',
  Cancelled = 'cancelled',
}

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Supplier, (supplier) => supplier.purchaseOrders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  supplier?: Supplier | null;

  @Column({ type: 'enum', enum: PurchaseOrderStatus, default: PurchaseOrderStatus.Draft })
  status: PurchaseOrderStatus;

  @Column({ name: 'total_cost', type: 'float', default: 0 })
  totalCost: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => PurchaseItem, (item) => item.purchaseOrder)
  items?: PurchaseItem[];
}
