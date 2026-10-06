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
import { BlogLikeService } from './blog-like.service';
import { fillDto } from '@project/helpers';

import { LikeRdo } from './rdo';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('likes')
export class BlogLikeController {
  constructor(private readonly blogLikeService: BlogLikeService) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    const like = await this.blogLikeService.getLike(id);
    return fillDto(LikeRdo, like?.toPOJO());
  }

  @Get('/')
  public async index(
    @Query('userId') userId?: string,
    @Query('postId') postId?: string
  ) {
    const entities = await this.blogLikeService.getAllLikes({
      userId,
      postId,
    });
    const likes = entities.map((entity) => entity.toPOJO());
    return fillDto(LikeRdo, likes);
  }

  @Post('/')
  public async create(@Body() dto: CreateLikeDto): Promise<LikeRdo> {
    const newLike = await this.blogLikeService.createLike(dto);
    return fillDto(LikeRdo, newLike.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string): Promise<void> {
    await this.blogLikeService.deleteLike(id);
  }
}
