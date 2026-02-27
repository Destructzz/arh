import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class MethodJwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method?.toUpperCase();
    if (method === 'OPTIONS') {
      return true;
    }

    if (method === 'GET') {
      const requiresUser = request.path.includes('/cart') || request.path.includes('/auth/me') || request.path.includes('/orders');
      if (!requiresUser && (!roles || roles.length === 0)) {
        // generic GETs (products, categories, etc.) bypass auth guard
        return true;
      }
    }

    return super.canActivate(context);
  }
}
