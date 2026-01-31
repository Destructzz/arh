import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { discountExample, discountIdExample, createDiscountExample, updateDiscountExample } from '../discounts.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { Discount } from '../entities/discounts.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateDiscountDto, DiscountsService, UpdateDiscountDto } from '../services/discounts.service';

@ApiTags('Discounts')
@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @ApiOperation({
    summary: 'Список скидок',
    description:
      'Возвращает список скидок и промокодов.\n' +
      'Используется для управления акциями и условиями продаж.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(Discount, true, discountExample)
  @Get()
  findAll() {
    return this.discountsService.findAll();
  }

  @ApiOperation({
    summary: 'Детали скидки',
    description:
      'Возвращает информацию о скидке по id.\n' +
      'Подходит для карточки акции и редактирования условий.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(Discount, false, discountExample)
  @ApiParam({
    name: 'id',
    example: discountIdExample,
    required: true,
    description: 'UUID скидки.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discountsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать скидку',
    description:
      'Создаёт новую скидку или промокод.\n' +
      'Используйте для запуска акции или кампании.\n' +
      'Обязательные параметры тела: code, type, value.',
  })
  @ApiBody({
    required: true,
    description: 'Обязательные поля: code, type, value. Опционально: startsAt, endsAt, isActive.',
    schema: { example: createDiscountExample },
  })
  @ApiCreatedAuthResponse(Discount, discountExample)
  @Post()
  create(@Body() body: CreateDiscountDto) {
    return this.discountsService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить скидку',
    description:
      'Частично обновляет параметры скидки.\n' +
      'Передайте изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateDiscountExample },
  })
  @ApiUpdatedAuthResponse(Discount, discountExample)
  @ApiParam({
    name: 'id',
    example: discountIdExample,
    required: true,
    description: 'UUID скидки.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateDiscountDto) {
    return this.discountsService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить скидку',
    description:
      'Удаляет скидку по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: discountIdExample,
    required: true,
    description: 'UUID скидки.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discountsService.remove(id);
  }
}






