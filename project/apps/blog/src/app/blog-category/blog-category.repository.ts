import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { BlogCategoryEntity } from './blog-category.entity';
import { Category } from '@project/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CategoryFilter,
  categoryFilterToPrismaFilter,
} from './blog-category.filter';
import { MAX_CATEGORIES_LIMIT } from './blog-category.constants';

@Injectable()
export class BlogCategoryRepository extends BasePostgresRepository<
  BlogCategoryEntity,
  Category
> {
  constructor(override readonly client: PrismaClientService) {
    super(client, BlogCategoryEntity.fromObject);
  }

  override async findById(id: string): Promise<BlogCategoryEntity | null> {
    const category = await this.client.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found.`);
    }

    return this.createEntityFromDocument(category);
  }

  public async find(filter?: CategoryFilter): Promise<BlogCategoryEntity[]> {
    const categories = await this.client.category.findMany({
      where: categoryFilterToPrismaFilter(filter),
      take: MAX_CATEGORIES_LIMIT,
    });

    return categories
      .map((category) => this.createEntityFromDocument(category))
      .filter((category): category is BlogCategoryEntity => category !== null);
  }

  override async save(entity: BlogCategoryEntity): Promise<BlogCategoryEntity> {
    const newCategory = await this.client.category.create({
      data: entity.toPOJO(),
    });

    entity.id = newCategory.id;
    return entity;
  }

  override async update(
    id: string,
    entity: BlogCategoryEntity
  ): Promise<BlogCategoryEntity> {
    const updatedCategory = await this.client.category.update({
      where: { id },
      data: {
        title: entity.title,
      },
    });

    const updatedEntity = this.createEntityFromDocument(updatedCategory);
    if (!updatedEntity) {
      throw new NotFoundException(`Category with id ${id} not found.`);
    }

    return updatedEntity;
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.category.delete({
      where: { id },
    });
  }
}
