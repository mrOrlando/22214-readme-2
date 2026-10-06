import { PrismaClientModule } from '@project/models';
import { Module } from '@nestjs/common';
import { BlogFavoriteRepository } from './blog-favorite.repository';
import { BlogFavoriteService } from './blog-favorite.service';
import { BlogFavoriteController } from './blog-favorite.controller';

@Module({
  imports: [PrismaClientModule],
  providers: [BlogFavoriteRepository, BlogFavoriteService],
  controllers: [BlogFavoriteController],
  exports: [BlogFavoriteService],
})
export class BlogFavoriteModule {}
