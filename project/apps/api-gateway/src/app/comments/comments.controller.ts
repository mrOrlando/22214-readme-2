import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
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
import { CommentsService } from './comments.service';
import { CommentsQuery, CreateCommentDto } from './dto';
import { CommentRdo, CommentsWithPaginationRdo } from './rdo';

const POST_ID = { name: 'postId', description: 'Post ID (UUID)' };
const UNAUTHORIZED = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'The access token is missing, invalid or expired.',
};
const POST_NOT_FOUND = {
  status: HttpStatus.NOT_FOUND,
  description: 'The published post not found.',
};

@ApiTags('comments')
@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary:
      'Get comments of a published post with their authors, newest first',
  })
  @ApiParam(POST_ID)
  @ApiResponse({ status: HttpStatus.OK, type: CommentsWithPaginationRdo })
  @ApiResponse(POST_NOT_FOUND)
  @Get('posts/:postId/comments')
  public async index(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: CommentsQuery
  ): Promise<CommentsWithPaginationRdo> {
    const comments = await this.commentsService.getComments(postId, query);
    return fillDto(CommentsWithPaginationRdo, comments);
  }

  @ApiOperation({
    summary: 'Comment a published post. The author is the current user',
  })
  @ApiBearerAuth()
  @ApiParam(POST_ID)
  @ApiResponse({ status: HttpStatus.CREATED, type: CommentRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The data is not valid.',
  })
  @ApiResponse(UNAUTHORIZED)
  @ApiResponse(POST_NOT_FOUND)
  @UseGuards(JwtAuthGuard)
  @Post('posts/:postId/comments')
  public async create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @CurrentUser() { sub }: TokenPayload,
    @Body() { message }: CreateCommentDto
  ): Promise<CommentRdo> {
    const comment = await this.commentsService.createComment(
      postId,
      sub,
      message
    );
    return fillDto(CommentRdo, comment);
  }

  @ApiOperation({ summary: 'Delete an own comment' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse(UNAUTHORIZED)
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user is not the author of the comment.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The comment not found.',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('comments/:id')
  public async destroy(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() { sub }: TokenPayload
  ): Promise<void> {
    await this.commentsService.deleteComment(id, sub);
  }
}
