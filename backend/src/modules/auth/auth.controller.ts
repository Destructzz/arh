import { Body, Controller, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';

interface RequestWithUser extends Request {
  user: {
    id: string;
    login: string;
    role: string;
  };
}
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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
    this.authService.setAuthCookies(res, result.accessToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @Public()
  @ApiBody({
    schema: {
      example: { login: 'manager', password: 'secret', email: 'manager@example.com' },
    },
  })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @Post('me')
  async me(@Req() req: RequestWithUser) {
    return { user: req.user };
  }

  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    return { user: req.user };
  }

  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.clearAuthCookies(res);
    return { loggedOut: true };
  }
}
