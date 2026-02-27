import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { Response } from 'express';
import { seedData } from '../seed-data';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
    @ApiOperation({
        summary: 'Получить данные для наполнения каталога',
        description: 'Возвращает данные с названиями категорий и товарами. Доступно только администраторам.'
    })
    @Roles(UserRole.admin, UserRole.manager)
    @Get('data')
    getSeedData(@Res() res: Response) {
        return res.status(200).send(seedData);
    }
}
