import { Controller, Get, Req } from '@nestjs/common';
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
}
