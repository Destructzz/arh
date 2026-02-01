import { UserRole } from '../entities/user.entity';
import { IsEnum } from 'class-validator';

export class SetRoleDto {
  @IsEnum(UserRole)
  role!: UserRole;
}
