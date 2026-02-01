import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { stockMovementExample, stockMovementIdExample, createStockMovementExample, updateStockMovementExample } from '../inventory.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { StockMovement } from '../entities/stock-movements.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import {
  CreateStockMovementDto,
  StockMovementsService,
  UpdateStockMovementDto,
} from '../services/stock-movements.service';

@ApiTags('Inventory')
@Controller('stock-movements')
export class StockMovementsController {
  constructor(private readonly movementsService: StockMovementsService) {}

  @ApiOperation({
    summary: 'Список движений склада',
    description:
      'Возвращает список движений склада с привязанным товаром.\n' +
      'Используется для аудита и истории изменения остатков.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(StockMovement, true, stockMovementExample)
  @Get()
  findAll() {
    return this.movementsService.findAll();
  }

  @ApiOperation({
    summary: 'Детали движения',
    description:
      'Возвращает детали движения склада по id.\n' +
      'Подходит для разбора конкретной операции.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(StockMovement, false, stockMovementExample)
  @ApiParam({
    name: 'id',
    example: stockMovementIdExample,
    required: true,
    description: 'UUID движения склада.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movementsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать движение',
    description:
      'Создаёт движение товара (приход/расход/корректировка).\n' +
      'Используйте для фиксации продаж, списаний и приёмок.\n' +
      'Обязательные параметры тела: productId, type, quantity, reason.',
  })
  @ApiBody({
    required: true,
    description:
      'Обязательные поля: productId, type, quantity, reason. Опционально: referenceType, referenceId.',
    schema: { example: createStockMovementExample },
  })
  @ApiCreatedAuthResponse(StockMovement, stockMovementExample)
  @Roles(UserRole.admin, UserRole.manager)
  @Post()
  create(@Body() body: CreateStockMovementDto) {
    return this.movementsService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить движение',
    description:
      'Частично обновляет параметры движения по id.\n' +
      'Передайте изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateStockMovementExample },
  })
  @ApiUpdatedAuthResponse(StockMovement, stockMovementExample)
  @ApiParam({
    name: 'id',
    example: stockMovementIdExample,
    required: true,
    description: 'UUID движения склада.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateStockMovementDto) {
    return this.movementsService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить движение',
    description:
      'Удаляет запись движения склада по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: stockMovementIdExample,
    required: true,
    description: 'UUID движения склада.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movementsService.remove(id);
  }
}






