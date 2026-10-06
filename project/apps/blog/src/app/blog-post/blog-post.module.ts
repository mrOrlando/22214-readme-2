import { PrismaClientModule } from '@project/models';
import { Module } from '@nestjs/common';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { BlogTagModule } from '../blog-tag/blog-tag.module';

@Module({
  imports: [PrismaClientModule, BlogTagModule],
  providers: [BlogPostRepository, BlogPostService],
  controllers: [BlogPostController],
})
export class BlogPostModule {}
