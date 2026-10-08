import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { fillDto } from '@project/helpers';
import { BlogPostService } from './blog-post.service';
import { PostRdo, PostWithPaginationRdo } from './rdo';
import { CreatePostDto, UpdatePostDto } from './dto';
import { BlogPostQuery, SearchPostQuery } from './query';
import { UserIdDto, UserIdQuery } from '../common';

@Controller('posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

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

  @Get('/drafts')
  public async drafts(@Query() { userId }: UserIdQuery): Promise<PostRdo[]> {
    const posts = await this.blogPostService.getDrafts(userId);
    return posts.map((post) => fillDto(PostRdo, post.toPOJO()));
  }

  @Get('/search')
  public async search(@Query() { title }: SearchPostQuery): Promise<PostRdo[]> {
    const posts = await this.blogPostService.searchPosts(title);
    return posts.map((post) => fillDto(PostRdo, post.toPOJO()));
  }

  @Get('/:id')
  public async show(@Param('id', ParseUUIDPipe) id: string): Promise<PostRdo> {
    const post = await this.blogPostService.getPost(id);
    return fillDto(PostRdo, post.toPOJO());
  }

  @Post('/')
  public async create(@Body() dto: CreatePostDto): Promise<PostRdo> {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(PostRdo, newPost.toPOJO());
  }

  @Post('/:id/repost')
  public async repost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { userId }: UserIdDto
  ): Promise<PostRdo> {
    const repost = await this.blogPostService.repostPost(id, userId);
    return fillDto(PostRdo, repost.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { userId }: UserIdQuery
  ): Promise<void> {
    await this.blogPostService.deletePost(id, userId);
  }

  @Patch('/:id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto
  ): Promise<PostRdo> {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }
}
