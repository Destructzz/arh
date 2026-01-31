import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { orderItemExample, orderItemIdExample, createOrderItemExample, updateOrderItemExample } from '../orders.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { OrderItem } from '../entities/order-items.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateOrderItemDto, OrderItemsService, UpdateOrderItemDto } from '../services/order-items.service';

@ApiTags('Orders')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @ApiOperation({
    summary: 'Список позиций заказов',
    description:
      'Возвращает список позиций заказов с товарами.\n' +
      'Полезно для аналитики и сверки составов заказов.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(OrderItem, true, orderItemExample)
  @Get()
  findAll() {
    return this.orderItemsService.findAll();
  }

  @ApiOperation({
    summary: 'Детали позиции заказа',
    description:
      'Возвращает позицию заказа по id.\n' +
      'Нужен для разборов и точечных правок.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(OrderItem, false, orderItemExample)
  @ApiParam({
    name: 'id',
    example: orderItemIdExample,
    required: true,
    description: 'UUID позиции заказа.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать позицию заказа',
    description:
      'Добавляет позицию в заказ.\n' +
      'Используйте при комплектации корзины и расчёте стоимости.\n' +
      'Обязательные параметры тела: orderId, qty, price, nameSnapshot.',
  })
  @ApiBody({
    required: true,
    description:
      'Обязательные поля: orderId, qty, price, nameSnapshot. Опционально: productId, costPrice.',
    schema: { example: createOrderItemExample },
  })
  @ApiCreatedAuthResponse(OrderItem, orderItemExample)
  @Post()
  create(@Body() body: CreateOrderItemDto) {
    return this.orderItemsService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить позицию заказа',
    description:
      'Частично обновляет позицию заказа по id.\n' +
      'Передайте изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateOrderItemExample },
  })
  @ApiUpdatedAuthResponse(OrderItem, orderItemExample)
  @ApiParam({
    name: 'id',
    example: orderItemIdExample,
    required: true,
    description: 'UUID позиции заказа.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateOrderItemDto) {
    return this.orderItemsService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить позицию заказа',
    description:
      'Удаляет позицию заказа по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: orderItemIdExample,
    required: true,
    description: 'UUID позиции заказа.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(id);
  }
}






