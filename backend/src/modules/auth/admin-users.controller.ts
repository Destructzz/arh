import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { SetRoleDto } from './dto/set-role.dto';
import { ApiOkAuthResponse } from '../../common/swagger/api-responses.decorator';
import { registerExample } from './auth.swagger';

@ApiTags('Admin Users')
@ApiBearerAuth()
@Controller('admin/users')
export class AdminUsersController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Изменить роль пользователя',
    description: 'Позволяет администратору изменить роль любого пользователя.',
  })
  @ApiOkAuthResponse(undefined, false, registerExample)
  @Roles(UserRole.admin)
  @ApiBody({ type: SetRoleDto })
  @Patch(':id/role')
  setRole(@Param('id') id: string, @Body() body: SetRoleDto) {
    return this.authService.setRole(id, body.role);
  }
}
