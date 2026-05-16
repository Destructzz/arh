import { Body, Controller, Post, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import {
  ApiOkAuthResponse,
  ApiCreatedAuthResponse,
} from '../../common/swagger/api-responses.decorator';
import {
  loginExample,
  registerExample,
  meExample,
  logoutExample,
} from './auth.swagger';
import { User } from '../users/entities/user.entity';

import { RequestWithUser } from './interfaces/request-with-user.interface';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @ApiOperation({
    summary: 'Авторизация пользователя',
    description: 'Вход в систему с получением JWT токена и установкой куки.',
  })
  @ApiOkAuthResponse(undefined, false, loginExample)
  @Public()
  @UseGuards(ThrottlerGuard)
  @ApiBody({ type: LoginDto })
  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(body.username, body.password);
    this.authService.setAuthCookies(res, result.accessToken);
    return { accessToken: result.accessToken, user: result.user };
  }

  @ApiOperation({
    summary: 'Регистрация нового пользователя',
    description: 'Создание аккаунта. По умолчанию назначается роль user.',
  })
  @ApiCreatedAuthResponse(undefined, registerExample)
  @Public()
  @ApiBody({ type: RegisterDto })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiOperation({
    summary: 'Получить текущего пользователя',
    description: 'Возвращает данные пользователя из JWT токена.',
  })
  @ApiOkAuthResponse(undefined, false, meExample)
  @ApiBearerAuth()
  @Get('me')
  async getMe(@Req() req: RequestWithUser) {
    return { user: req.user };
  }

  @ApiOperation({
    summary: 'Выход из системы',
    description: 'Удаляет авторизационные куки.',
  })
  @ApiOkAuthResponse(undefined, false, logoutExample)
  @Public()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    this.authService.clearAuthCookies(res);
    return { loggedOut: true };
  }
}
