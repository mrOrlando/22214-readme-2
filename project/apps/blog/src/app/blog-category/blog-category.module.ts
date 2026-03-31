import { PrismaClientModule } from '@project/models';
import { Module } from '@nestjs/common';
import { BlogCategoryRepository } from './blog-category.repository';
import { BlogCategoryService } from './blog-category.service';
import { BlogCategoryController } from './blog-category.controller';

@Module({
  imports: [PrismaClientModule],
  providers: [BlogCategoryRepository, BlogCategoryService],
  controllers: [BlogCategoryController],
})
export class BlogCategoryModule {}
