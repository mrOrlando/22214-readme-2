import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { PostsModule } from '../posts/posts.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [ClientsModule, PostsModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
