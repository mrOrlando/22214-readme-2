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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import { BlogPostService } from './blog-post.service';
import { PostRdo, PostWithPaginationRdo } from './rdo';
import { CreatePostDto, UpdatePostDto } from './dto';
import { BlogPostQuery, SearchPostQuery } from './query';
import { UserIdDto, UserIdQuery } from '../common';

@ApiTags('posts')
@Controller('posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @ApiOperation({
    summary:
      'Get published posts with pagination, sorting and filters by author, type and tag',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A page of published posts.',
    type: PostWithPaginationRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Query parameters are not valid.',
  })
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

  @ApiOperation({ summary: 'Get drafts of the user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Drafts of the user.',
    type: [PostRdo],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The user ID is not valid.',
  })
  @Get('/drafts')
  public async drafts(@Query() { userId }: UserIdQuery): Promise<PostRdo[]> {
    const posts = await this.blogPostService.getDrafts(userId);
    return posts.map((post) => fillDto(PostRdo, post.toPOJO()));
  }

  @ApiOperation({
    summary: 'Search published posts by title (20 posts at most)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found posts.',
    type: [PostRdo],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The search string is empty.',
  })
  @Get('/search')
  public async search(@Query() { title }: SearchPostQuery): Promise<PostRdo[]> {
    const posts = await this.blogPostService.searchPosts(title);
    return posts.map((post) => fillDto(PostRdo, post.toPOJO()));
  }

  @ApiOperation({ summary: 'Get post details' })
  @ApiParam({ name: 'id', description: 'Post ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The post has been found.',
    type: PostRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The post ID is not a valid UUID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The post with this ID not found.',
  })
  @Get('/:id')
  public async show(@Param('id', ParseUUIDPipe) id: string): Promise<PostRdo> {
    const post = await this.blogPostService.getPost(id);
    return fillDto(PostRdo, post.toPOJO());
  }

  @ApiOperation({ summary: 'Create a post' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The post has been created.',
    type: PostRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @Post('/')
  public async create(@Body() dto: CreatePostDto): Promise<PostRdo> {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(PostRdo, newPost.toPOJO());
  }

  @ApiOperation({
    summary: 'Repost a published post. A user can repost a post only once',
  })
  @ApiParam({ name: 'id', description: 'Post ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The repost has been created.',
    type: PostRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The published post with this ID not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The post is already reposted by this user.',
  })
  @Post('/:id/repost')
  public async repost(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { userId }: UserIdDto
  ): Promise<PostRdo> {
    const repost = await this.blogPostService.repostPost(id, userId);
    return fillDto(PostRdo, repost.toPOJO());
  }

  @ApiOperation({ summary: 'Delete own post with its comments and likes' })
  @ApiParam({ name: 'id', description: 'Post ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The post has been deleted.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The post ID or the user ID is not valid.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user is not the author of the post.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The post with this ID not found.',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { userId }: UserIdQuery
  ): Promise<void> {
    await this.blogPostService.deletePost(id, userId);
  }

  @ApiOperation({ summary: 'Update own post' })
  @ApiParam({ name: 'id', description: 'Post ID (UUID)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The post has been updated.',
    type: PostRdo,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'The user is not the author of the post.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The post with this ID not found.',
  })
  @Patch('/:id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePostDto
  ): Promise<PostRdo> {
    const updatedPost = await this.blogPostService.updatePost(id, dto);
    return fillDto(PostRdo, updatedPost.toPOJO());
  }
}
