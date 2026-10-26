import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { FilesModule } from '../files/files.module';
import { UsersModule } from '../users/users.module';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [ClientsModule, FilesModule, UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
