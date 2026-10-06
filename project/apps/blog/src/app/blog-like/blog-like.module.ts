import { PrismaClientModule } from '@project/models';
import { Module } from '@nestjs/common';
import { BlogLikeRepository } from './blog-like.repository';
import { BlogLikeService } from './blog-like.service';
import { BlogLikeController } from './blog-like.controller';

@Module({
  imports: [PrismaClientModule],
  providers: [BlogLikeRepository, BlogLikeService],
  controllers: [BlogLikeController],
  exports: [BlogLikeService],
})
export class BlogLikeModule {}
