import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogCategoryRepository } from './blog-category.repository';
import { BlogCategoryEntity } from './blog-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class BlogCategoryService {
  constructor(
    private readonly blogCategoryRepository: BlogCategoryRepository
  ) {}

  public async getCategory(id: string): Promise<BlogCategoryEntity | null> {
    return this.blogCategoryRepository.findById(id);
  }

  public async getAllCategories(): Promise<BlogCategoryEntity[]> {
    return this.blogCategoryRepository.find();
  }

  public async getCategoriesByIds(
    categoryIds: string[]
  ): Promise<BlogCategoryEntity[]> {
    return this.blogCategoryRepository.findByIds(categoryIds);
  }

  public async createCategory(
    dto: CreateCategoryDto
  ): Promise<BlogCategoryEntity> {
    const existingCategory = (
      await this.blogCategoryRepository.find({
        title: dto.title,
      })
    ).at(0);

    if (existingCategory) {
      throw new ConflictException('Category with this title already exists');
    }

    const newCategory = new BlogCategoryEntity(dto);
    await this.blogCategoryRepository.save(newCategory);

    return newCategory;
  }

  public async deleteCategory(id: string): Promise<void> {
    try {
      await this.blogCategoryRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }

  public async updateCategory(
    id: string,
    dto: UpdateCategoryDto
  ): Promise<BlogCategoryEntity> {
    const entity = new BlogCategoryEntity(dto);

    try {
      const updatedCategory = await this.blogCategoryRepository.update(
        id,
        entity
      );
      return updatedCategory;
    } catch {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }
}
