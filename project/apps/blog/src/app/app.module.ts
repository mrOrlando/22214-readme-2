import { Module } from '@nestjs/common';
import { ConfigBlogModule } from '@project/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogTagModule } from './blog-tag/blog-tag.module';
import { BlogCommentModule } from './blog-comment/blog-comment.module';
import { BlogLikeModule } from './blog-like/blog-like.module';
import { BlogPostModule } from './blog-post/blog-post.module';

@Module({
  imports: [
    ConfigBlogModule.register(),
    BlogTagModule,
    BlogCommentModule,
    BlogLikeModule,
    BlogPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
