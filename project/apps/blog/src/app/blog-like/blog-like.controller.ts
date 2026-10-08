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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import { BlogLikeService } from './blog-like.service';
import { LikeRdo } from './rdo';
import { UserIdDto, UserIdQuery } from '../common';

@ApiTags('likes')
@Controller('posts/:postId/likes')
export class BlogLikeController {
  constructor(private readonly blogLikeService: BlogLikeService) {}

  @ApiOperation({
    summary: 'Like a published post. A user can like a post only once',
  })
  @ApiParam({ name: 'postId', description: 'Post ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The like has been added.',
    type: LikeRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The post ID or the user ID is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The published post with this ID not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The post is already liked by this user.',
  })
  @Post('/')
  public async create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() { userId }: UserIdDto
  ): Promise<LikeRdo> {
    const newLike = await this.blogLikeService.likePost(postId, userId);
    return fillDto(LikeRdo, newLike.toPOJO());
  }

  @ApiOperation({ summary: 'Remove own like from a post' })
  @ApiParam({ name: 'postId', description: 'Post ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The like has been removed.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The post ID or the user ID is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user has not liked this post.',
  })
  @Delete('/')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() { userId }: UserIdQuery
  ): Promise<void> {
    await this.blogLikeService.unlikePost(postId, userId);
  }
}
