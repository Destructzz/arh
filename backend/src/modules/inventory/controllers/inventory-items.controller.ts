import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { inventoryItemExample, inventoryItemIdExample, createInventoryItemExample, updateInventoryItemExample } from '../inventory.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { InventoryItem } from '../entities/inventory-items.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import {
  CreateInventoryItemDto,
  InventoryItemsService,
  UpdateInventoryItemDto,
} from '../services/inventory-items.service';

@ApiTags('Inventory')
@Controller('inventory-items')
export class InventoryItemsController {
  constructor(private readonly inventoryService: InventoryItemsService) {}

  @ApiOperation({
    summary: 'Список складских позиций',
    description:
      'Возвращает список складских позиций с привязанным товаром.\n' +
      'Помогает видеть остатки и резервы по SKU.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(InventoryItem, true, inventoryItemExample)
  @Get()
  findAll() {
    return this.inventoryService.findAll();
  }

  @ApiOperation({
    summary: 'Детали складской позиции',
    description:
      'Возвращает складскую позицию по id.\n' +
      'Используйте для точечного контроля остатков.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(InventoryItem, false, inventoryItemExample)
  @ApiParam({
    name: 'id',
    example: inventoryItemIdExample,
    required: true,
    description: 'UUID складской позиции.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать складскую позицию',
    description:
      'Создаёт складскую позицию для товара.\n' +
      'Используйте при заведении нового SKU на складе.\n' +
      'Обязательные параметры тела: productId.',
  })
  @ApiBody({
    required: true,
    description: 'Обязательные поля: productId. Опционально: quantityOnHand, reserved.',
    schema: { example: createInventoryItemExample },
  })
  @ApiCreatedAuthResponse(InventoryItem, inventoryItemExample)
  @Roles(UserRole.admin, UserRole.manager)
  @Post()
  create(@Body() body: CreateInventoryItemDto) {
    return this.inventoryService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить складскую позицию',
    description:
      'Частично обновляет остатки или резервы по id.\n' +
      'Передайте только изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateInventoryItemExample },
  })
  @ApiUpdatedAuthResponse(InventoryItem, inventoryItemExample)
  @ApiParam({
    name: 'id',
    example: inventoryItemIdExample,
    required: true,
    description: 'UUID складской позиции.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateInventoryItemDto) {
    return this.inventoryService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить складскую позицию',
    description:
      'Удаляет складскую позицию по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: inventoryItemIdExample,
    required: true,
    description: 'UUID складской позиции.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}






