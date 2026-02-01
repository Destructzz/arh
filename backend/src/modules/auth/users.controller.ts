import { Body, Controller, Param, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { AuthService } from './auth.service';
import { SetRoleDto } from './dto/set-role.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Roles(UserRole.admin)
  @ApiBody({
    schema: {
      example: { role: 'manager' },
    },
  })
  @Patch(':id/role')
  setRole(@Param('id') id: string, @Body() body: SetRoleDto) {
    return this.authService.setRole(id, body.role);
  }
}
