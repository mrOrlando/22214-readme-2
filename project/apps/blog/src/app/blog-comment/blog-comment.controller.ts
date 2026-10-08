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
import { fillDto } from '@project/helpers';
import { BlogCommentService } from './blog-comment.service';
import { CommentRdo, CommentWithPaginationRdo } from './rdo';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BlogCommentQuery } from './query/blog-comment.query';
import { UserIdQuery } from '../common';

@Controller()
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

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

  @Post('posts/:postId/comments')
  public async create(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() dto: CreateCommentDto
  ): Promise<CommentRdo> {
    const newComment = await this.blogCommentService.createComment(postId, dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @Get('comments/:id')
  public async show(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<CommentRdo> {
    const comment = await this.blogCommentService.getComment(id);
    return fillDto(CommentRdo, comment.toPOJO());
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { userId }: UserIdQuery
  ): Promise<void> {
    await this.blogCommentService.deleteComment(id, userId);
  }
}
