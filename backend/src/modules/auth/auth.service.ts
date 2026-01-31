import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { createHash, randomBytes } from 'node:crypto';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from './entities/user.entity';
import type { Response } from 'express';

export interface TokenMeta {
  ip?: string;
  userAgent?: string;
}

export interface IssuedTokens {
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepo: Repository<RefreshToken>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

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

  async login(username: string, password: string, meta: TokenMeta) {
    const user = await this.validateUser(username, password);
    const tokens = await this.issueTokens(user, meta);
    return {
      user: { id: user.id, login: user.login, role: user.role },
      ...tokens,
    };
  }

  async refresh(refreshToken: string, meta: TokenMeta): Promise<IssuedTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const stored = await this.findRefreshToken(refreshToken);
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalid');
    }

    if (!stored.user?.isActive) {
      throw new UnauthorizedException('User inactive');
    }

    stored.revokedAt = new Date();
    await this.refreshRepo.save(stored);

    return this.issueTokens(stored.user, meta);
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }
    const stored = await this.findRefreshToken(refreshToken);
    if (!stored || stored.revokedAt) {
      return;
    }
    stored.revokedAt = new Date();
    await this.refreshRepo.save(stored);
  }

  assertCsrf(csrfHeader?: string, csrfCookie?: string) {
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      throw new ForbiddenException('Invalid CSRF token');
    }
  }

  setAuthCookies(res: Response, refreshToken: string, csrfToken: string) {
    const maxAge = this.getRefreshTtlMs();
    const secure = this.isProd();
    const sameSite = 'lax' as const;
    const path = '/auth';

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
      secure,
      sameSite,
      path,
      maxAge,
    });

    res.cookie('csrf', csrfToken, {
      httpOnly: false,
      secure,
      sameSite,
      path,
      maxAge,
    });
  }

  clearAuthCookies(res: Response) {
    const secure = this.isProd();
    const sameSite = 'lax' as const;
    const path = '/auth';
    res.clearCookie('refresh', { httpOnly: true, secure, sameSite, path });
    res.clearCookie('csrf', { httpOnly: false, secure, sameSite, path });
  }

  private async issueTokens(user: User, meta: TokenMeta): Promise<IssuedTokens> {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      login: user.login,
      role: user.role,
    });

    const refreshToken = this.generateToken();
    const csrfToken = this.generateToken();

    const refreshEntity = this.refreshRepo.create({
      user,
      tokenHash: this.hashToken(refreshToken),
      expiresAt: new Date(Date.now() + this.getRefreshTtlMs()),
      userAgent: meta.userAgent ?? null,
      ip: meta.ip ?? null,
    });

    await this.refreshRepo.save(refreshEntity);
    return { accessToken, refreshToken, csrfToken };
  }

  private async findRefreshToken(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);
    return this.refreshRepo.findOne({
      where: { tokenHash },
      relations: { user: true },
    });
  }

  private hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private generateToken() {
    return randomBytes(32).toString('hex');
  }

  private getRefreshTtlMs() {
    const days = this.config.get<number>('JWT_REFRESH_TTL_DAYS', 30);
    return days * 24 * 60 * 60 * 1000;
  }

  private isProd() {
    return this.config.get<string>('NODE_ENV', 'development') === 'production';
  }
}
