import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'johndoe', description: 'Логин пользователя' })
  @IsString()
  @IsNotEmpty()
  login!: string;

  @ApiProperty({ example: 'strongpassword', description: 'Пароль пользователя' })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({ example: 'user@example.com', required: false, nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string | null;

  @ApiProperty({ example: '+79991234567', required: false, nullable: true })
  @IsString()
  @IsOptional()
  phone?: string | null;
}
