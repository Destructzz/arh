import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../../catalog/entities/products.entity';
import { PurchaseOrder } from './purchase-orders.entity';

@Entity('purchase_items')
export class PurchaseItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PurchaseOrder, (order) => order.items, { onDelete: 'CASCADE' })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => Product, { onDelete: 'SET NULL', nullable: true })
  product?: Product | null;

  @Column({ type: 'int' })
  qty: number;

  @Column({ name: 'unit_cost', type: 'float', default: 0 })
  unitCost: number;
}

