import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { PostsModule } from '../posts/posts.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [ClientsModule, PostsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
