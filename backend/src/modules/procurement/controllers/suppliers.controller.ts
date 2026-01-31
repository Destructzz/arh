import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { supplierExample, supplierIdExample, createSupplierExample, updateSupplierExample } from '../procurement.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { Supplier } from '../entities/suppliers.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateSupplierDto, SuppliersService, UpdateSupplierDto } from '../services/suppliers.service';

@ApiTags('Procurement')
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @ApiOperation({
    summary: 'Список поставщиков',
    description:
      'Возвращает список поставщиков и их контакты.\n' +
      'Используется для закупок и связи с контрагентами.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(Supplier, true, supplierExample)
  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  @ApiOperation({
    summary: 'Детали поставщика',
    description:
      'Возвращает поставщика по id.\n' +
      'Нужен для карточки контрагента и редактирования.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(Supplier, false, supplierExample)
  @ApiParam({
    name: 'id',
    example: supplierIdExample,
    required: true,
    description: 'UUID поставщика.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suppliersService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать поставщика',
    description:
      'Создаёт поставщика с контактами.\n' +
      'Используйте при подключении нового контрагента.\n' +
      'Обязательные параметры тела: name.',
  })
  @ApiBody({
    required: true,
    description: 'Обязательные поля: name. Опционально: phone, email, address.',
    schema: { example: createSupplierExample },
  })
  @ApiCreatedAuthResponse(Supplier, supplierExample)
  @Post()
  create(@Body() body: CreateSupplierDto) {
    return this.suppliersService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить поставщика',
    description:
      'Частично обновляет данные поставщика по id.\n' +
      'Передайте изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateSupplierExample },
  })
  @ApiUpdatedAuthResponse(Supplier, supplierExample)
  @ApiParam({
    name: 'id',
    example: supplierIdExample,
    required: true,
    description: 'UUID поставщика.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateSupplierDto) {
    return this.suppliersService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить поставщика',
    description:
      'Удаляет поставщика по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: supplierIdExample,
    required: true,
    description: 'UUID поставщика.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suppliersService.remove(id);
  }
}






