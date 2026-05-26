import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import type { Response } from 'express';
import { UserRole } from '../users/entities/user.entity';

export interface TokenMeta {
  ip?: string;
  userAgent?: string;
}

export interface IssuedToken {
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .where('user.login = :username', { username })
      .orWhere('user.email = :username', { username })
      .orWhere('user.phone = :username', { username })
      .getOne();

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await argon2.verify(user.passwordHash, password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const token = await this.issueToken(user);
    return {
      user: { id: user.id, login: user.login, role: user.role, email: user.email, phone: user.phone },
      ...token,
    };
  }

  async register(payload: { login: string; password: string; email?: string | null; phone?: string | null }) {
    const whereConditions: any[] = [{ login: payload.login }];
    if (payload.email) whereConditions.push({ email: payload.email });
    if (payload.phone) whereConditions.push({ phone: payload.phone });

    const existing = await this.usersRepo.findOne({ where: whereConditions });

    if (existing) {
      throw new BadRequestException('User already exists');
    }

    const passwordHash = await argon2.hash(payload.password);
    const user = this.usersRepo.create({
      login: payload.login,
      passwordHash,
      email: payload.email ?? null,
      phone: payload.phone ?? null,
      role: UserRole.user,
      isActive: true,
    });
    const saved = await this.usersRepo.save(user);
    return { id: saved.id, login: saved.login, role: saved.role };
  }

  async setRole(userId: string, role: UserRole) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    user.role = role;
    const saved = await this.usersRepo.save(user);
    return { id: saved.id, login: saved.login, role: saved.role };
  }

  setAuthCookies(res: Response, accessToken: string) {
    const maxAge = this.getAccessTtlMs();
    const secure = this.isProd();
    const sameSite = 'lax' as const;
    const path = '/';

    res.cookie('access', accessToken, {
      httpOnly: true,
      secure,
      sameSite,
      path,
      maxAge,
    });
  }

  clearAuthCookies(res: Response) {
    const secure = this.isProd();
    const sameSite = 'lax' as const;
    const path = '/';
    res.clearCookie('access', { httpOnly: true, secure, sameSite, path });
  }

  private async issueToken(user: User): Promise<IssuedToken> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      login: user.login,
      role: user.role,
    });
    return { accessToken };
  }

  private getAccessTtlMs() {
    const days = this.config.get<number>('JWT_ACCESS_TTL_DAYS', 3);
    return days * 24 * 60 * 60 * 1000;
  }

  private isProd() {
    return this.config.get<string>('NODE_ENV', 'development') === 'production';
  }
}
