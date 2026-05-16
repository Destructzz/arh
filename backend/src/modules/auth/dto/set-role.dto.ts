import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class SetRoleDto {
  @ApiProperty({ enum: UserRole, example: UserRole.manager })
  @IsEnum(UserRole)
  role: UserRole;
}