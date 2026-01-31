import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { customerExample, customerIdExample, createCustomerExample, updateCustomerExample } from '../customers.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { Customer } from '../entities/customers.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateCustomerDto, CustomersService, UpdateCustomerDto } from '../services/customers.service';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({
    summary: 'Список клиентов',
    description:
      'Возвращает список клиентов и их лояльность.\n' +
      'Используется для CRM, поиска и фильтрации покупателей.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(Customer, true, customerExample)
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @ApiOperation({
    summary: 'Детали клиента',
    description:
      'Возвращает клиента и связанную лояльность.\n' +
      'Подходит для карточки клиента и редактирования профиля.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(Customer, false, customerExample)
  @ApiParam({
    name: 'id',
    example: customerIdExample,
    required: true,
    description: 'UUID клиента.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать клиента',
    description:
      'Создаёт клиента с контактами и заметками.\n' +
      'Используйте при регистрации или ручном добавлении в CRM.\n' +
      'Обязательные параметры тела: name.',
  })
  @ApiBody({
    required: true,
    description: 'Обязательные поля: name. Опционально: phone, email, birthday, notes.',
    schema: { example: createCustomerExample },
  })
  @ApiCreatedAuthResponse(Customer, customerExample)
  @Post()
  create(@Body() body: CreateCustomerDto) {
    return this.customersService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить клиента',
    description:
      'Частично обновляет профиль клиента по id.\n' +
      'Передайте только изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateCustomerExample },
  })
  @ApiUpdatedAuthResponse(Customer, customerExample)
  @ApiParam({
    name: 'id',
    example: customerIdExample,
    required: true,
    description: 'UUID клиента.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCustomerDto) {
    return this.customersService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить клиента',
    description:
      'Удаляет клиента по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: customerIdExample,
    required: true,
    description: 'UUID клиента.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}






