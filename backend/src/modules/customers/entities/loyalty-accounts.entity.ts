import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Customer } from './customers.entity';

@Entity('loyalty_accounts')
export class LoyaltyAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Customer, (customer) => customer.loyaltyAccount, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ length: 80, default: 'base' })
  level: string;
}
