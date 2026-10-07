import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { fillDto } from '@project/helpers';

import { CommentRdo, CommentWithPaginationRdo } from './rdo';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BlogCommentQuery } from './query/blog-comment.query';

@Controller()
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Get('comments/:id')
  public async show(@Param('id') id: string) {
    return this.blogCommentService.getComment(id);
  }

  @Get('posts/:postId/comments')
  public async index(
    @Param('postId') postId: string,
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

  @Post('comments')
  public async create(@Body() dto: CreateCommentDto): Promise<CommentRdo> {
    const newComment = await this.blogCommentService.createComment(dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @Delete('comments/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string): Promise<void> {
    await this.blogCommentService.deleteComment(id);
  }

  @Patch('comments/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto
  ): Promise<CommentRdo> {
    const updatedComment = await this.blogCommentService.updateComment(
      id,
      dto
    );
    return fillDto(CommentRdo, updatedComment.toPOJO());
  }
}
