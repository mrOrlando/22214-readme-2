import { PrismaClientModule } from '@project/models';
import { Module } from '@nestjs/common';
import { BlogCommentRepository } from './blog-comment.repository';
import { BlogCommentService } from './blog-comment.service';
import { BlogCommentController } from './blog-comment.controller';

@Module({
  imports: [PrismaClientModule],
  providers: [BlogCommentRepository, BlogCommentService],
  controllers: [BlogCommentController],
  exports: [BlogCommentService],
})
export class BlogCommentModule {}
