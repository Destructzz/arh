import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { PurchaseOrder } from './purchase-orders.entity';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  email?: string | null;

  @Column({ type: 'text', nullable: true })
  address?: string | null;

  @OneToMany(() => PurchaseOrder, (order) => order.supplier)
  purchaseOrders?: PurchaseOrder[];
}
