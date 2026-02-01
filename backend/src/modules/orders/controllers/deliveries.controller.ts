import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { deliveryExample, deliveryIdExample, createDeliveryExample, updateDeliveryExample } from '../orders.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { Delivery } from '../entities/deliveries.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { CreateDeliveryDto, DeliveriesService, UpdateDeliveryDto } from '../services/deliveries.service';

@ApiTags('Orders')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @ApiOperation({
    summary: 'Список доставок',
    description:
      'Возвращает список доставок с привязкой к заказам.\n' +
      'Используется диспетчером и курьерами для контроля статусов.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(Delivery, true, deliveryExample)
  @Get()
  findAll() {
    return this.deliveriesService.findAll();
  }

  @ApiOperation({
    summary: 'Детали доставки',
    description:
      'Возвращает доставку по id.\n' +
      'Нужен для трекинга и поддержки клиента.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(Delivery, false, deliveryExample)
  @ApiParam({
    name: 'id',
    example: deliveryIdExample,
    required: true,
    description: 'UUID доставки.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deliveriesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать доставку',
    description:
      'Создаёт доставку для заказа с адресом и окнами времени.\n' +
      'Используйте при назначении доставки курьеру.\n' +
      'Обязательные параметры тела: orderId, address.',
  })
  @ApiBody({
    required: true,
    description:
      'Обязательные поля: orderId, address. Опционально: deliveryTimeFrom, deliveryTimeTo, courierId, status.',
    schema: { example: createDeliveryExample },
  })
  @ApiCreatedAuthResponse(Delivery, deliveryExample)
  @Roles(UserRole.admin, UserRole.manager, UserRole.courier)
  @Post()
  create(@Body() body: CreateDeliveryDto) {
    return this.deliveriesService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить доставку',
    description:
      'Частично обновляет доставку (статус, время, курьер) по id.\n' +
      'Передайте изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateDeliveryExample },
  })
  @ApiUpdatedAuthResponse(Delivery, deliveryExample)
  @ApiParam({
    name: 'id',
    example: deliveryIdExample,
    required: true,
    description: 'UUID доставки.',
  })
  @Roles(UserRole.admin, UserRole.manager, UserRole.courier)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateDeliveryDto) {
    return this.deliveriesService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить доставку',
    description:
      'Удаляет доставку по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: deliveryIdExample,
    required: true,
    description: 'UUID доставки.',
  })
  @Roles(UserRole.admin, UserRole.manager, UserRole.courier)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deliveriesService.remove(id);
  }
}






