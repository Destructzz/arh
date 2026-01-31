import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { purchaseItemExample, purchaseItemIdExample, createPurchaseItemExample, updatePurchaseItemExample } from '../procurement.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { PurchaseItem } from '../entities/purchase-items.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import {
  CreatePurchaseItemDto,
  PurchaseItemsService,
  UpdatePurchaseItemDto,
} from '../services/purchase-items.service';

@ApiTags('Procurement')
@Controller('purchase-items')
export class PurchaseItemsController {
  constructor(private readonly purchaseItemsService: PurchaseItemsService) {}

  @ApiOperation({
    summary: 'Список позиций закупок',
    description:
      'Возвращает список позиций закупок с товарами и заказами.\n' +
      'Полезно для контроля закупочных цен и объёмов.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(PurchaseItem, true, purchaseItemExample)
  @Get()
  findAll() {
    return this.purchaseItemsService.findAll();
  }

  @ApiOperation({
    summary: 'Детали позиции закупки',
    description:
      'Возвращает позицию закупки по id.\n' +
      'Нужен для точечной корректировки или проверки.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(PurchaseItem, false, purchaseItemExample)
  @ApiParam({
    name: 'id',
    example: purchaseItemIdExample,
    required: true,
    description: 'UUID позиции закупки.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseItemsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать позицию закупки',
    description:
      'Добавляет позицию в заказ поставщику.\n' +
      'Используйте при формировании закупки.\n' +
      'Обязательные параметры тела: purchaseOrderId, qty.',
  })
  @ApiBody({
    required: true,
    description: 'Обязательные поля: purchaseOrderId, qty. Опционально: productId, unitCost.',
    schema: { example: createPurchaseItemExample },
  })
  @ApiCreatedAuthResponse(PurchaseItem, purchaseItemExample)
  @Post()
  create(@Body() body: CreatePurchaseItemDto) {
    return this.purchaseItemsService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить позицию закупки',
    description:
      'Частично обновляет позицию закупки по id.\n' +
      'Передайте изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updatePurchaseItemExample },
  })
  @ApiUpdatedAuthResponse(PurchaseItem, purchaseItemExample)
  @ApiParam({
    name: 'id',
    example: purchaseItemIdExample,
    required: true,
    description: 'UUID позиции закупки.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePurchaseItemDto) {
    return this.purchaseItemsService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить позицию закупки',
    description:
      'Удаляет позицию закупки по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: purchaseItemIdExample,
    required: true,
    description: 'UUID позиции закупки.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseItemsService.remove(id);
  }
}






