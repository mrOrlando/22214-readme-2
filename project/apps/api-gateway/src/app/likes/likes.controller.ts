import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import type { TokenPayload } from '@project/types';
import { CurrentUser } from '../auth/decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlogClient } from '../clients/blog.client';
import { LikeRdo } from './like.rdo';

const POST_ID = { name: 'postId', description: 'Post ID (UUID)' };
const UNAUTHORIZED = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'The access token is missing, invalid or expired.',
};

@ApiTags('likes')
@ApiBearerAuth()
@Controller('posts/:postId/likes')
export class LikesController {
  constructor(private readonly blogClient: BlogClient) {}

  @ApiOperation({
    summary: 'Like a published post. A user can like a post only once',
  })
  @ApiParam(POST_ID)
  @ApiResponse({ status: HttpStatus.CREATED, type: LikeRdo })
  @ApiResponse(UNAUTHORIZED)
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The published post not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The post is already liked by the user.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/')
  public async like(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() { sub }: TokenPayload
  ): Promise<LikeRdo> {
    const like = await this.blogClient.likePost(postId, sub);
    return fillDto(LikeRdo, like);
  }

  @ApiOperation({ summary: 'Take back an own like' })
  @ApiParam(POST_ID)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse(UNAUTHORIZED)
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The user has not liked the post.',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/')
  public async unlike(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() { sub }: TokenPayload
  ): Promise<void> {
    await this.blogClient.unlikePost(postId, sub);
  }
}
