import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { paymentExample, paymentIdExample, createPaymentExample, updatePaymentExample } from '../orders.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { Payment } from '../entities/payments.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { CreatePaymentDto, PaymentsService, UpdatePaymentDto } from '../services/payments.service';

@ApiTags('Orders')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({
    summary: 'Список платежей',
    description:
      'Возвращает список платежей с привязкой к заказам.\n' +
      'Используется для контроля оплат и статусов транзакций.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(Payment, true, paymentExample)
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @ApiOperation({
    summary: 'Детали платежа',
    description:
      'Возвращает платеж по id.\n' +
      'Подходит для просмотра истории оплаты и статуса.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(Payment, false, paymentExample)
  @ApiParam({
    name: 'id',
    example: paymentIdExample,
    required: true,
    description: 'UUID платежа.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать платеж',
    description:
      'Создаёт запись оплаты по заказу.\n' +
      'Используйте при приёме платежей или фиксации транзакций.\n' +
      'Обязательные параметры тела: orderId, method, amount.',
  })
  @ApiBody({
    required: true,
    description:
      'Обязательные поля: orderId, method, amount. Опционально: status, paidAt.',
    schema: { example: createPaymentExample },
  })
  @ApiCreatedAuthResponse(Payment, paymentExample)
  @Roles(UserRole.admin, UserRole.manager)
  @Post()
  create(@Body() body: CreatePaymentDto) {
    return this.paymentsService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить платеж',
    description:
      'Частично обновляет платеж по id (статус, сумма и т.д.).\n' +
      'Передайте изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updatePaymentExample },
  })
  @ApiUpdatedAuthResponse(Payment, paymentExample)
  @ApiParam({
    name: 'id',
    example: paymentIdExample,
    required: true,
    description: 'UUID платежа.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePaymentDto) {
    return this.paymentsService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить платеж',
    description:
      'Удаляет платеж по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: paymentIdExample,
    required: true,
    description: 'UUID платежа.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}






