import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum DiscountType {
  Percent = 'percent',
  Fixed = 'fixed',
}

@Entity('discounts')
export class Discount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 80 })
  code: string;

  @Column({ type: 'enum', enum: DiscountType })
  type: DiscountType;

  @Column({ type: 'float' })
  value: number;

  @Column({ name: 'starts_at', type: 'timestamp', nullable: true })
  startsAt?: Date | null;

  @Column({ name: 'ends_at', type: 'timestamp', nullable: true })
  endsAt?: Date | null;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;
}
