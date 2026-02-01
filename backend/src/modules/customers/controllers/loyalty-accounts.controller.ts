import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { loyaltyAccountExample, loyaltyAccountIdExample, createLoyaltyAccountExample, updateLoyaltyAccountExample } from '../customers.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { LoyaltyAccount } from '../entities/loyalty-accounts.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import {
  CreateLoyaltyAccountDto,
  LoyaltyAccountsService,
  UpdateLoyaltyAccountDto,
} from '../services/loyalty-accounts.service';

@ApiTags('Customers')
@Controller('loyalty-accounts')
export class LoyaltyAccountsController {
  constructor(private readonly loyaltyService: LoyaltyAccountsService) {}

  @ApiOperation({
    summary: 'Список лояльных счетов',
    description:
      'Возвращает список лояльных счетов с привязкой к клиенту.\n' +
      'Полезно для контроля баллов и уровней.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(LoyaltyAccount, true, loyaltyAccountExample)
  @Get()
  findAll() {
    return this.loyaltyService.findAll();
  }

  @ApiOperation({
    summary: 'Детали лояльного счёта',
    description:
      'Возвращает один лояльный счёт и клиента.\n' +
      'Используйте для просмотра статуса и начислений.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(LoyaltyAccount, false, loyaltyAccountExample)
  @ApiParam({
    name: 'id',
    example: loyaltyAccountIdExample,
    required: true,
    description: 'UUID лояльного счёта.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loyaltyService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать лояльный счёт',
    description:
      'Создаёт лояльный счёт для клиента.\n' +
      'Обычно используется после регистрации клиента.\n' +
      'Обязательные параметры тела: customerId.',
  })
  @ApiBody({
    required: true,
    description: 'Обязательные поля: customerId. Опционально: points, level.',
    schema: { example: createLoyaltyAccountExample },
  })
  @ApiCreatedAuthResponse(LoyaltyAccount, loyaltyAccountExample)
  @Roles(UserRole.admin, UserRole.manager)
  @Post()
  create(@Body() body: CreateLoyaltyAccountDto) {
    return this.loyaltyService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить лояльный счёт',
    description:
      'Частично обновляет баллы или уровень лояльности.\n' +
      'Передайте только изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateLoyaltyAccountExample },
  })
  @ApiUpdatedAuthResponse(LoyaltyAccount, loyaltyAccountExample)
  @ApiParam({
    name: 'id',
    example: loyaltyAccountIdExample,
    required: true,
    description: 'UUID лояльного счёта.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateLoyaltyAccountDto) {
    return this.loyaltyService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить лояльный счёт',
    description:
      'Удаляет лояльный счёт по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: loyaltyAccountIdExample,
    required: true,
    description: 'UUID лояльного счёта.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loyaltyService.remove(id);
  }
}






