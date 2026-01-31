import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { purchaseOrderExample, purchaseOrderIdExample, createPurchaseOrderExample, updatePurchaseOrderExample } from '../procurement.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { PurchaseOrder } from '../entities/purchase-orders.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import {
  CreatePurchaseOrderDto,
  PurchaseOrdersService,
  UpdatePurchaseOrderDto,
} from '../services/purchase-orders.service';

@ApiTags('Procurement')
@Controller('purchase-orders')
export class PurchaseOrdersController {
  constructor(private readonly purchaseOrdersService: PurchaseOrdersService) {}

  @ApiOperation({
    summary: 'Список закупочных заказов',
    description:
      'Возвращает список заказов поставщикам с позициями и поставщиком.\n' +
      'Используется для контроля закупок и статусов.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(PurchaseOrder, true, purchaseOrderExample)
  @Get()
  findAll() {
    return this.purchaseOrdersService.findAll();
  }

  @ApiOperation({
    summary: 'Детали закупочного заказа',
    description:
      'Возвращает заказ поставщику с позициями и поставщиком.\n' +
      'Нужен для сверки и приёмки товара.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(PurchaseOrder, false, purchaseOrderExample)
  @ApiParam({
    name: 'id',
    example: purchaseOrderIdExample,
    required: true,
    description: 'UUID закупочного заказа.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.purchaseOrdersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать закупочный заказ',
    description:
      'Создаёт заказ поставщику (можно как черновик).\n' +
      'Используйте перед добавлением закупочных позиций.\n' +
      'Обязательные параметры тела: нет.',
  })
  @ApiBody({
    required: true,
    description: 'Опционально: supplierId, status, totalCost. Можно создать пустой черновик.',
    schema: { example: createPurchaseOrderExample },
  })
  @ApiCreatedAuthResponse(PurchaseOrder, purchaseOrderExample)
  @Post()
  create(@Body() body: CreatePurchaseOrderDto) {
    return this.purchaseOrdersService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить закупочный заказ',
    description:
      'Частично обновляет заказ поставщику (статус, поставщик, суммы).\n' +
      'Передайте изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updatePurchaseOrderExample },
  })
  @ApiUpdatedAuthResponse(PurchaseOrder, purchaseOrderExample)
  @ApiParam({
    name: 'id',
    example: purchaseOrderIdExample,
    required: true,
    description: 'UUID закупочного заказа.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePurchaseOrderDto) {
    return this.purchaseOrdersService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить закупочный заказ',
    description:
      'Удаляет заказ поставщику по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: purchaseOrderIdExample,
    required: true,
    description: 'UUID закупочного заказа.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.purchaseOrdersService.remove(id);
  }
}






