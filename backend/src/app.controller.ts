import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Проверка доступности',
    description:
      'Простой healthcheck эндпоинт, возвращает строку приветствия.\n' +
      'Используйте для проверки, что API живо и отвечает.\n' +
      'Обязательные параметры: нет.',
  })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
