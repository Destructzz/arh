import { IsEnum, IsUUID } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class SetRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}