import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BlogCategoryService } from './blog-category.service';
import { fillDto } from '@project/helpers';

import { CategoryRdo } from './rdo';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class BlogCategoryController {
  constructor(private readonly blogCategoryService: BlogCategoryService) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    return this.blogCategoryService.getCategory(id);
  }

  @Get('/')
  public async index() {
    const entities = await this.blogCategoryService.getAllCategories();
    const categories = entities.map((entity) => entity.toPOJO());
    return fillDto(CategoryRdo, categories);
  }

  @Post('/')
  public async create(@Body() dto: CreateCategoryDto): Promise<CategoryRdo> {
    const newCategory = await this.blogCategoryService.createCategory(dto);
    return fillDto(CategoryRdo, newCategory.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string): Promise<void> {
    await this.blogCategoryService.deleteCategory(id);
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto
  ): Promise<CategoryRdo> {
    const updatedCategory = await this.blogCategoryService.updateCategory(
      id,
      dto
    );
    return fillDto(CategoryRdo, updatedCategory.toPOJO());
  }
}
