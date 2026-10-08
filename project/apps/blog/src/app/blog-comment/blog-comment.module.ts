import { PrismaClientModule } from '@project/models';
import { Module } from '@nestjs/common';
import { BlogPostModule } from '../blog-post/blog-post.module';
import { BlogCommentRepository } from './blog-comment.repository';
import { BlogCommentService } from './blog-comment.service';
import { BlogCommentController } from './blog-comment.controller';

@Module({
  imports: [PrismaClientModule, BlogPostModule],
  providers: [BlogCommentRepository, BlogCommentService],
  controllers: [BlogCommentController],
  exports: [BlogCommentService],
})
export class BlogCommentModule {}
