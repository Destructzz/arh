import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { LoyaltyAccount } from './loyalty-accounts.entity';
import { Order } from '../../orders/entities/orders.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 160 })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  email?: string | null;

  @Column({ type: 'date', nullable: true })
  birthday?: string | null;

  @Column({ type: 'text', nullable: true })
  notes?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.customer)
  orders?: Order[];

  @OneToOne(() => LoyaltyAccount, (account) => account.customer)
  loyaltyAccount?: LoyaltyAccount;
}

