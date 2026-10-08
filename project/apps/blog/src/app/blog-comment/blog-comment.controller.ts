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
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import { BlogCommentService } from './blog-comment.service';
import { CommentRdo, CommentWithPaginationRdo } from './rdo';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BlogCommentQuery } from './query/blog-comment.query';
import { UserIdQuery } from '../common';

@ApiTags('comments')
@Controller()
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @ApiOperation({ summary: 'Get comments of a published post' })
  @ApiParam({ name: 'postId', description: 'Post ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A page of comments, newest first.',
    type: CommentWithPaginationRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The post ID or query parameters are not valid.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The published post with this ID not found.',
  })
  @Get('posts/:postId/comments')
  public async index(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Query() query: BlogCommentQuery
  ): Promise<CommentWithPaginationRdo> {
    const commentsWithPagination = await this.blogCommentService.getComments(
      postId,
      query
    );

    return fillDto(CommentWithPaginationRdo, {
      ...commentsWithPagination,
      entities: commentsWithPagination.entities.map((comment) =>
        comment.toPOJO()
      ),
    });
  }

  @ApiOperation({ summary: 'Add a comment to a published post' })
  @ApiParam({ name: 'postId', description: 'Post ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The comment has been created.',
    type: CommentRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The published post with this ID not found.',
  })
  @Post('posts/:postId/comments')
  public async create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto
  ): Promise<CommentRdo> {
    const newComment = await this.blogCommentService.createComment(postId, dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @ApiOperation({ summary: 'Get a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)' })
  @ApiResponse({ status: HttpStatus.OK, type: CommentRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The comment ID is not a valid UUID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The comment with this ID not found.',
  })
  @Get('comments/:id')
  public async show(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<CommentRdo> {
    const comment = await this.blogCommentService.getComment(id);
    return fillDto(CommentRdo, comment.toPOJO());
  }

  @ApiOperation({ summary: 'Delete own comment' })
  @ApiParam({ name: 'id', description: 'Comment ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The comment has been deleted.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The comment ID or the user ID is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user is not the author of the comment.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The comment with this ID not found.',
  })
  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { userId }: UserIdQuery
  ): Promise<void> {
    await this.blogCommentService.deleteComment(id, userId);
  }
}
