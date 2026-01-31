import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Product } from '../../catalog/entities/products.entity';

export enum StockMovementType {
  In = 'in',
  Out = 'out',
  Adjust = 'adjust',
}

export enum StockMovementReason {
  Sale = 'sale',
  Purchase = 'purchase',
  Writeoff = 'writeoff',
  Adjust = 'adjust',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  product: Product;

  @Column({ type: 'enum', enum: StockMovementType })
  type: StockMovementType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'enum', enum: StockMovementReason })
  reason: StockMovementReason;

  @Column({ name: 'reference_type', type: 'varchar', length: 60, nullable: true })
  referenceType?: string | null;

  @Column({ name: 'reference_id', type: 'varchar', length: 120, nullable: true })
  referenceId?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

