import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { fillDto } from '@project/helpers';
import { BlogLikeService } from './blog-like.service';
import { LikeRdo } from './rdo';
import { UserIdDto, UserIdQuery } from '../common';

@Controller('posts/:postId/likes')
export class BlogLikeController {
  constructor(private readonly blogLikeService: BlogLikeService) {}

  @Post('/')
  public async create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() { userId }: UserIdDto
  ): Promise<LikeRdo> {
    const newLike = await this.blogLikeService.likePost(postId, userId);
    return fillDto(LikeRdo, newLike.toPOJO());
  }

  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() { userId }: UserIdQuery
  ): Promise<void> {
    await this.blogLikeService.unlikePost(postId, userId);
  }
}
