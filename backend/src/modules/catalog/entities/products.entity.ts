import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { InventoryItem } from '../../inventory/entities/inventory-items.entity';
import { Category } from './categories.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  category?: Category | null;

  @Column({ type: 'float' })
  price: number;

  @Column({ name: 'cost_price', type: 'float', default: 0 })
  costPrice: number;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl?: string | null;

  @OneToOne(() => InventoryItem, (item) => item.product)
  inventoryItem?: InventoryItem;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}