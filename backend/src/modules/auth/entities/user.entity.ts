import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RefreshToken } from './refresh-token.entity';

export enum UserRole {
  admin = 'admin',
  manager = 'manager',
  florist = 'florist',
  courier = 'courier',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 160, unique: true, nullable: true })
  email?: string | null;

  @Column({ type: 'varchar', length: 30, unique: true, nullable: true })
  phone?: string | null;

  @Column({ unique: true })
  login: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.manager })
  role: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];
}
