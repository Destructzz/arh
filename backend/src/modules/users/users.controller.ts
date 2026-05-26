import { Controller, Get, Put, Body, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from '../auth/interfaces/request-with-user.interface';
import { ApiOkAuthResponse } from '../../common/swagger/api-responses.decorator';
import { UsersService } from './users.service';
import { userStatsExample } from './users.swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: 'Получить статистику текущего пользователя',
    description: 'Возвращает дату регистрации, количество покупок и общую сумму трат.',
  })
  @ApiOkAuthResponse(undefined, false, userStatsExample)
  @Get('me/stats')
  getMeStats(@Req() req: RequestWithUser) {
    console.log(req.user);
    return this.usersService.getUserStats(req.user.id);
  }

  @ApiOperation({
    summary: 'Обновить профиль текущего пользователя',
    description: 'Позволяет обновить email и номер телефона.',
  })
  @Put('me')
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() body: { phone?: string | null; email?: string | null },
  ) {
    const updated = await this.usersService.updateProfile(req.user.id, body);
    return {
      user: {
        id: updated.id,
        login: updated.login,
        role: updated.role,
        email: updated.email,
        phone: updated.phone,
      },
    };
  }
}
