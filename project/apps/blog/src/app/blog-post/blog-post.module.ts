import { PrismaClientModule } from '@project/models';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { getRabbitMQClientOptions } from '@project/config';
import { RabbitPublisher } from '@project/helpers';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostService } from './blog-post.service';
import { BlogPostController } from './blog-post.controller';
import { BlogTagModule } from '../blog-tag/blog-tag.module';

@Module({
  imports: [
    PrismaClientModule,
    BlogTagModule,
    ClientsModule.registerAsync([getRabbitMQClientOptions()]),
  ],
  providers: [BlogPostRepository, BlogPostService, RabbitPublisher],
  controllers: [BlogPostController],
  exports: [BlogPostService],
})
export class BlogPostModule {}
