import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogCategoryModule } from './blog-category/blog-category.module';
import { BlogCommentModule } from './blog-comment/blog-comment.module';
import { BlogPostModule } from './blog-post/blog-post.module';

@Module({
  imports: [BlogCategoryModule, BlogCommentModule, BlogPostModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
