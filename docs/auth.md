# AIS Flower Shop - Auth (JWT + Refresh + CSRF)

Этот файл фиксирует выбранный путь авторизации для внутренней системы (staff-only).

## Кратко по потоку
1) `POST /auth/login` (body: username/password)
   - Ответ JSON: `accessToken` + `csrfToken`
   - Cookie: `refresh` (httpOnly), опционально `csrf` (обычно не httpOnly)
2) Обычные запросы:
   - `Authorization: Bearer <accessToken>`
   - Для state-changing (POST/PATCH/DELETE) добавляем `X-CSRF-Token`
3) `POST /auth/refresh` (body пустой)
   - Браузер сам отправляет cookie `refresh` (+ `csrf` если используется)
   - Сервер проверяет refresh + CSRF и выдает новый `accessToken`
   - Refresh токен ротируется (новый refresh + новый csrf)
4) `POST /auth/logout`
   - Отзываем refresh (revoked) и чистим cookie

## Где хранится access/refresh/csrf
- Access: в памяти приложения (store/state), не localStorage.
- Refresh: httpOnly cookie.
- CSRF: double-submit: `csrf` cookie + `X-CSRF-Token` header.

## Почему нужен CSRF при refresh в cookie
Cookie отправляются автоматически. Без проверки можно подделать запрос из чужого сайта.

Минимум:
- проверка `Origin` или `Referer`.

Надежнее (double submit):
- Сервер отдает `csrfToken` при логине.
- Клиент отправляет `X-CSRF-Token`, сервер сверяет с cookie `csrf`.

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
- Access TTL: 15-30 мин
- Refresh TTL: 7-30 дней
- Refresh хранить только в виде hash в БД
- Пароли: argon2 (или bcrypt)
