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
import { fillDto } from '@project/helpers';
import { BlogPostService } from './blog-post.service';

import { PostRdo, PostWithPaginationRdo } from './rdo';
import { CreatePostDto, CreateRepostDto, UpdatePostDto } from './dto';
import { BlogPostQuery } from './query';

@Controller('posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    return this.blogPostService.getPost(id);
  }

  @Get('/')
  public async index(
    @Query() query: BlogPostQuery
  ): Promise<PostWithPaginationRdo> {
    const postsWithPagination = await this.blogPostService.getPosts(query);

    return fillDto(PostWithPaginationRdo, {
      ...postsWithPagination,
      entities: postsWithPagination.entities.map((post) => post.toPOJO()),
    });
  }

  @Post('/')
  public async create(@Body() dto: CreatePostDto): Promise<PostRdo> {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(PostRdo, newPost.toPOJO());
  }

  @Post('/:id/repost')
  public async repost(
    @Param('id') id: string,
    @Body() dto: CreateRepostDto
  ): Promise<PostRdo> {
    const repost = await this.blogPostService.repostPost(id, dto);
    return fillDto(PostRdo, repost.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string): Promise<void> {
    await this.blogPostService.deletePost(id);
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto
  ): Promise<PostRdo> {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }
}
