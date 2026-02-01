import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { categoryExample, categoryIdExample, createCategoryExample, updateCategoryExample } from '../catalog.swagger';
import { ApiCreatedAuthResponse, ApiDeleteAuthResponse, ApiAuthResponses, ApiUpdatedAuthResponse } from '../../../common/swagger/api-responses.decorator';
import { Category } from '../entities/categories.entity';

import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/entities/user.entity';
import {
  CategoriesService,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../services/categories.service';

@ApiTags('Catalog')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({
    summary: 'Список категорий',
    description:
      'Возвращает список категорий с родителями и дочерними узлами.\n' +
      'Используйте для построения дерева каталога и фильтров витрины.\n' +
      'Обязательные параметры: нет.',
  })
  @ApiAuthResponses(Category, true, categoryExample)
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Детали категории',
    description:
      'Возвращает одну категорию со связями.\n' +
      'Подходит для карточки категории и редактирования.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiAuthResponses(Category, false, categoryExample)
  @ApiParam({
    name: 'id',
    example: categoryIdExample,
    required: true,
    description: 'UUID категории.',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Создать категорию',
    description:
      'Создаёт новую категорию каталога.\n' +
      'Нужен для админки при добавлении групп товаров.\n' +
      'Обязательные параметры тела: name.',
  })
  @ApiBody({
    required: true,
    description: 'Обязательные поля: name. Опционально: parentId для вложенной категории.',
    schema: { example: createCategoryExample },
  })
  @ApiCreatedAuthResponse(Category, categoryExample)
  @Roles(UserRole.admin, UserRole.manager)
  @Post()
  create(@Body() body: CreateCategoryDto) {
    return this.categoriesService.create(body);
  }

  @ApiOperation({
    summary: 'Обновить категорию',
    description:
      'Частично обновляет категорию по id.\n' +
      'Передайте только изменяемые поля; минимум одно.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiBody({
    required: true,
    description: 'Тело запроса: изменяемые поля (name, parentId); минимум одно.',
    schema: { example: updateCategoryExample },
  })
  @ApiUpdatedAuthResponse(Category, categoryExample)
  @ApiParam({
    name: 'id',
    example: categoryIdExample,
    required: true,
    description: 'UUID категории.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
    return this.categoriesService.update(id, body);
  }

  @ApiOperation({
    summary: 'Удалить категорию',
    description:
      'Удаляет категорию по id.\n' +
      'Используйте осторожно, если есть связанные товары.\n' +
      'Обязательные параметры: id (UUID) в пути.',
  })
  @ApiDeleteAuthResponse()
  @ApiParam({
    name: 'id',
    example: categoryIdExample,
    required: true,
    description: 'UUID категории.',
  })
  @Roles(UserRole.admin, UserRole.manager)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}






