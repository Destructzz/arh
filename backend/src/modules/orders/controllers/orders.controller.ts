import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { orderExample, orderIdExample, createOrderExample, updateOrderExample } from '../orders.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { Order } from '../entities/orders.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { CreateOrderDto, OrdersService, UpdateOrderDto } from '../services/orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({
    summary: 'Список заказов',
    description:
      'Возвращает список заказов с клиентом, позициями, оплатами и доставкой.\n' +
      'Используется для операционной панели и обработки заказов.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(Order, true, orderExample)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({
    summary: 'Детали заказа',
    description:
      'Возвращает детали заказа с позициями, оплатами и доставкой.\n' +
      'Подходит для карточки заказа и поддержки клиентов.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(Order, false, orderExample)
  @ApiParam({
    name: 'id',
    example: orderIdExample,
    required: true,
    description: 'UUID заказа.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать заказ',
    description:
      'Создаёт заказ и базовые финансовые поля.\n' +
      'Используйте при оформлении заказа в любом канале.\n' +
      'Обязательные параметры тела: channel, deliveryType.',
  })
  @ApiBody({
    required: true,
    description:
      'Обязательные поля: channel, deliveryType. Опционально: customerId, status, totalPrice, totalCost, discountAmount.',
    schema: { example: createOrderExample },
  })
  @ApiCreatedAuthResponse(Order, orderExample)
  @Roles(UserRole.admin, UserRole.manager, UserRole.florist)
  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить заказ',
    description:
      'Частично обновляет заказ (статус, суммы, клиент) по id.\n' +
      'Передайте изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateOrderExample },
  })
  @ApiUpdatedAuthResponse(Order, orderExample)
  @ApiParam({
    name: 'id',
    example: orderIdExample,
    required: true,
    description: 'UUID заказа.',
  })
  @Roles(UserRole.admin, UserRole.manager, UserRole.florist)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateOrderDto) {
    return this.ordersService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить заказ',
    description:
      'Удаляет заказ по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: orderIdExample,
    required: true,
    description: 'UUID заказа.',
  })
  @Roles(UserRole.admin, UserRole.manager, UserRole.florist)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}






