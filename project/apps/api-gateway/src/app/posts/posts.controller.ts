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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import type { TokenPayload } from '@project/types';
import { CurrentUser } from '../auth/decorators';
import { MAX_PHOTO_SIZE } from '../files/files.constants';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import {
  CreatePostDto,
  PostsQuery,
  SearchPostsQuery,
  UpdatePostDto,
} from './dto';
import { PostRdo, PostsWithPaginationRdo } from './rdo';
import { PostsService } from './posts.service';

const PHOTO_UPLOAD = FileInterceptor('photo', {
  limits: { files: 1, fileSize: MAX_PHOTO_SIZE },
});

const POST_ID = { name: 'id', description: 'Post ID (UUID)' };
const UNAUTHORIZED = {
  status: HttpStatus.UNAUTHORIZED,
  description: 'The access token is missing, invalid or expired.',
};
const BAD_REQUEST = {
  status: HttpStatus.BAD_REQUEST,
  description: 'The data is not valid. The list of all errors is returned.',
};
const FORBIDDEN = {
  status: HttpStatus.FORBIDDEN,
  description: 'The user is not the author of the post.',
};
const NOT_FOUND = {
  status: HttpStatus.NOT_FOUND,
  description: 'The post not found.',
};

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary:
      'Get published posts with their authors: pagination, sorting by date, likes or comments, filters by author, type and tag',
  })
  @ApiResponse({ status: HttpStatus.OK, type: PostsWithPaginationRdo })
  @ApiResponse(BAD_REQUEST)
  @Get('/')
  public async index(
    @Query() query: PostsQuery
  ): Promise<PostsWithPaginationRdo> {
    const posts = await this.postsService.getPosts(query);
    return fillDto(PostsWithPaginationRdo, posts);
  }

  @ApiOperation({
    summary: 'Search published posts by words of the title (20 posts at most)',
  })
  @ApiResponse({ status: HttpStatus.OK, type: [PostRdo] })
  @ApiResponse(BAD_REQUEST)
  @Get('/search')
  public async search(
    @Query() { title }: SearchPostsQuery
  ): Promise<PostRdo[]> {
    const posts = await this.postsService.searchPosts(title);
    return posts.map((post) => fillDto(PostRdo, post));
  }

  @ApiOperation({ summary: 'Get drafts of the current user' })
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: [PostRdo] })
  @ApiResponse(UNAUTHORIZED)
  @UseGuards(JwtAuthGuard)
  @Get('/drafts')
  public async drafts(
    @CurrentUser() { sub }: TokenPayload
  ): Promise<PostRdo[]> {
    const posts = await this.postsService.getDrafts(sub);
    return posts.map((post) => fillDto(PostRdo, post));
  }

  @ApiOperation({
    summary:
      'Get a post. A draft is shown only to its author, who has to send the access token',
  })
  @ApiBearerAuth()
  @ApiParam(POST_ID)
  @ApiResponse({ status: HttpStatus.OK, type: PostRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The post ID is not a valid UUID.',
  })
  @ApiResponse(NOT_FOUND)
  @UseGuards(OptionalJwtAuthGuard)
  @Get('/:id')
  public async show(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user?: TokenPayload
  ): Promise<PostRdo> {
    const post = await this.postsService.getPost(id, user?.sub);
    return fillDto(PostRdo, post);
  }

  @ApiOperation({
    summary:
      'Create a post. The author is the current user; required fields depend on the type of the post. A "photo" post is sent as multipart/form-data with the image in the "photo" field',
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.CREATED, type: PostRdo })
  @ApiResponse(BAD_REQUEST)
  @ApiResponse(UNAUTHORIZED)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(PHOTO_UPLOAD)
  @Post('/')
  public async create(
    @CurrentUser() { sub }: TokenPayload,
    @Body() dto: CreatePostDto,
    @UploadedFile() photo?: Express.Multer.File
  ): Promise<PostRdo> {
    const post = await this.postsService.createPost(sub, dto, photo);
    return fillDto(PostRdo, post);
  }

  @ApiOperation({
    summary:
      'Update an own post. The photo of a "photo" post is replaced with the image in the "photo" field of a multipart/form-data request',
  })
  @ApiConsumes('application/json', 'multipart/form-data')
  @ApiBearerAuth()
  @ApiParam(POST_ID)
  @ApiResponse({ status: HttpStatus.OK, type: PostRdo })
  @ApiResponse(BAD_REQUEST)
  @ApiResponse(UNAUTHORIZED)
  @ApiResponse(FORBIDDEN)
  @ApiResponse(NOT_FOUND)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(PHOTO_UPLOAD)
  @Patch('/:id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() { sub }: TokenPayload,
    @Body() dto: UpdatePostDto,
    @UploadedFile() photo?: Express.Multer.File
  ): Promise<PostRdo> {
    const post = await this.postsService.updatePost(id, sub, dto, photo);
    return fillDto(PostRdo, post);
  }

  @ApiOperation({ summary: 'Delete an own post with its comments and likes' })
  @ApiBearerAuth()
  @ApiParam(POST_ID)
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse(UNAUTHORIZED)
  @ApiResponse(FORBIDDEN)
  @ApiResponse(NOT_FOUND)
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  public async destroy(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() { sub }: TokenPayload
  ): Promise<void> {
    await this.postsService.deletePost(id, sub);
  }

  @ApiOperation({
    summary:
      'Repost a published post of another user. A post can be reposted once',
  })
  @ApiBearerAuth()
  @ApiParam(POST_ID)
  @ApiResponse({ status: HttpStatus.CREATED, type: PostRdo })
  @ApiResponse(UNAUTHORIZED)
  @ApiResponse(NOT_FOUND)
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The user has already reposted this post.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('/:id/repost')
  public async repost(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() { sub }: TokenPayload
  ): Promise<PostRdo> {
    const post = await this.postsService.repostPost(id, sub);
    return fillDto(PostRdo, post);
  }
}
