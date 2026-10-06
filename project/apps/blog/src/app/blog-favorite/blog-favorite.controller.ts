import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { BlogFavoriteService } from './blog-favorite.service';
import { fillDto } from '@project/helpers';

import { FavoriteRdo } from './rdo';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Controller('favorites')
export class BlogFavoriteController {
  constructor(private readonly blogFavoriteService: BlogFavoriteService) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const favorite = await this.blogFavoriteService.getFavorite(id);
    return fillDto(FavoriteRdo, favorite?.toPOJO());
  }

  @Get('/')
  public async index(
    @Query('userId') userId?: string,
    @Query('postId') postId?: string
  ) {
    const entities = await this.blogFavoriteService.getAllFavorites({
      userId,
      postId,
    });
    const favorites = entities.map((entity) => entity.toPOJO());
    return fillDto(FavoriteRdo, favorites);
  }

  @Post('/')
  public async create(@Body() dto: CreateFavoriteDto): Promise<FavoriteRdo> {
    const newFavorite = await this.blogFavoriteService.createFavorite(dto);
    return fillDto(FavoriteRdo, newFavorite.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string): Promise<void> {
    await this.blogFavoriteService.deleteFavorite(id);
  }
}
