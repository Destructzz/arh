import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../orders/entities/orders.entity';

export enum UserRole {
  admin = 'admin',
  manager = 'manager',
  florist = 'florist',
  courier = 'courier',
  user = 'user',
}

@Entity('users')
export class User {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'user@example.com', required: false, nullable: true })
  @Column({ type: 'varchar', length: 160, unique: true, nullable: true })
  email?: string | null;

  @ApiProperty({ example: '+79991234567', required: false, nullable: true })
  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  phone?: string | null;

  @ApiProperty({ example: 'johndoe' })
  @Column({ unique: true })
  login: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @ApiProperty({ example: true })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ enum: UserRole, example: UserRole.user })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.user })
  role: UserRole;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders?: Order[];
}
