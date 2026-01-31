import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Product } from '../../catalog/entities/products.entity';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, (product) => product.inventoryItem, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'quantity_on_hand', type: 'int', default: 0 })
  quantityOnHand: number;

  @Column({ type: 'int', default: 0 })
  reserved: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

