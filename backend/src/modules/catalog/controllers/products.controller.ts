import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { productExample, productIdExample, createProductExample, updateProductExample } from '../catalog.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { Product } from '../entities/products.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import { CreateProductDto, ProductsService, UpdateProductDto } from '../services/products.service';

@ApiTags('Catalog')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Список товаров',
    description:
      'Возвращает список товаров с категорией и остатками.\n' +
      'Используется для витрины и админки.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(Product, true, productExample)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @ApiOperation({
    summary: 'Детали товара',
    description:
      'Возвращает карточку товара с категорией и инвентарём.\n' +
      'Нужен для просмотра и редактирования.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(Product, false, productExample)
  @ApiParam({
    name: 'id',
    example: productIdExample,
    required: true,
    description: 'UUID товара.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать товар',
    description:
      'Создаёт новый товар и возвращает сохранённую запись.\n' +
      'Используйте при добавлении SKU в каталог.\n' +
      'Обязательные параметры тела: name, price.',
  })
  @ApiBody({
    required: true,
    description:
      'Обязательные поля: name, price. Опционально: description, categoryId, costPrice, isActive, imageUrl.',
    schema: { example: createProductExample },
  })
  @ApiCreatedAuthResponse(Product, productExample)
  @Roles(UserRole.admin, UserRole.manager)
  @Post()
  create(@Body() body: CreateProductDto) {
    return this.productsService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить товар',
    description:
      'Частично обновляет товар по id.\n' +
      'Передайте только изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: любые изменяемые поля; минимум одно.',
    schema: { example: updateProductExample },
  })
  @ApiUpdatedAuthResponse(Product, productExample)
  @ApiParam({
    name: 'id',
    example: productIdExample,
    required: true,
    description: 'UUID товара.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateProductDto) {
    return this.productsService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить товар',
    description:
      'Удаляет товар по id.\n' +
      'Возвращает флаг удаления.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: productIdExample,
    required: true,
    description: 'UUID товара.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}






