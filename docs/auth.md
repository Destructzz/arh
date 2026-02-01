# AIS Flower Shop - Auth (JWT Access Only)

Этот файл фиксирует выбранный путь авторизации для внутренней системы (staff-only).

## Кратко по потоку
1) `POST /auth/login` (body: username/password)
   - Ответ JSON: `accessToken`
   - Cookie: `access` (httpOnly)
2) Обычные запросы:
   - `Authorization: Bearer <accessToken>` или cookie `access`
3) `POST /auth/logout`
   - Чистим cookie
4) `POST /auth/register`
   - Создает пользователя с ролью `manager`
5) `POST /auth/superme` (только development)
   - Делает пользователя `superme` по логину/паролю
6) `PATCH /users/:id/role` (только admin)
   - Назначает любую роль пользователю

## Где хранится access
- Access: httpOnly cookie `access` (живет 3 дня).

## Роли (MVP)
- admin
- manager (cashier)
- florist
- courier

## Swagger: как показывать авторизацию
В `main.ts`:
```ts
const config = new DocumentBuilder()
  .setTitle('AIS Flower Shop API')
  .setDescription('MVP API documentation')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
```

На контроллерах:
```ts
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {}
```

## Декораторы и Guards

### @Public()
Снимает требование JWT-guard для открытых эндпоинтов (если будут).
```ts
export const Public = () => SetMetadata('isPublic', true);
```

### @Roles(...)
Помечает разрешенные роли. Сам по себе не блокирует.
```ts
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

### JwtAuthGuard
Пропускает `@Public()`, иначе валидирует JWT.
```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(ctx: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(ctx);
  }
}
```

### RolesGuard
Читает метаданные `@Roles()` и сравнивает с `req.user.role`.
```ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext) {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!roles?.length) return true;
    const { user } = ctx.switchToHttp().getRequest();
    return roles.includes(user.role);
  }
}
```

## Пример использования
```ts
@ApiBearerAuth()
@Roles('admin', 'manager')
@Controller('products')
export class ProductsController {}
```

## Замечания
- Access TTL: 3 дня
- Пароли: argon2 (или bcrypt)
