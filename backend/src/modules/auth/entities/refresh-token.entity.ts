import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: User;

  @Column({ name: 'token_hash' })
  tokenHash: string;

  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;

  @Column({ name: 'revoked_at', type: 'timestamptz', nullable: true })
  revokedAt?: Date | null;

  @Column({ name: 'user_agent', type: 'varchar', length: 255, nullable: true })
  userAgent?: string | null;

  @Column({ name: 'ip', type: 'varchar', length: 45, nullable: true })
  ip?: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
