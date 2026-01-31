import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(ThrottlerGuard)
  @ApiBody({
    schema: {
      example: { username: 'admin', password: 'secret' },
    },
  })
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const result = await this.authService.login(body.username, body.password, meta);
    this.authService.setAuthCookies(res, result.refreshToken, result.csrfToken);
    return { accessToken: result.accessToken, csrfToken: result.csrfToken, user: result.user };
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh as string | undefined;
    const csrfHeader = req.headers['x-csrf-token'] as string | undefined;
    const csrfCookie = req.cookies?.csrf as string | undefined;
    this.authService.assertCsrf(csrfHeader, csrfCookie);
    const meta = { ip: req.ip, userAgent: req.headers['user-agent'] };
    const result = await this.authService.refresh(refreshToken ?? '', meta);
    this.authService.setAuthCookies(res, result.refreshToken, result.csrfToken);
    return { accessToken: result.accessToken, csrfToken: result.csrfToken };
  }

  @Public()
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh as string | undefined;
    if (!refreshToken) {
      this.authService.clearAuthCookies(res);
      return { loggedOut: true };
    }
    const csrfHeader = req.headers['x-csrf-token'] as string | undefined;
    const csrfCookie = req.cookies?.csrf as string | undefined;
    this.authService.assertCsrf(csrfHeader, csrfCookie);
    await this.authService.logout(refreshToken);
    this.authService.clearAuthCookies(res);
    return { loggedOut: true };
  }
}
