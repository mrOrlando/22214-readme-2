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
} from '@nestjs/common';
import { BlogCommentService } from './blog-comment.service';
import { fillDto } from '@project/helpers';

import { CommentRdo } from './rdo';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    return this.blogCommentService.getComment(id);
  }

  @Get('/')
  public async index() {
    const entities = await this.blogCommentService.getAllComments();
    const comments = entities.map((entity) => entity.toPOJO());
    return fillDto(CommentRdo, comments);
  }

  @Post('/')
  public async create(@Body() dto: CreateCommentDto): Promise<CommentRdo> {
    const newComment = await this.blogCommentService.createComment(dto);
    return fillDto(CommentRdo, newComment.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string): Promise<void> {
    await this.blogCommentService.deleteComment(id);
  }

  @Patch('/:id')
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
