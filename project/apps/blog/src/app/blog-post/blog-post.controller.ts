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
import { fillDto } from '@project/helpers';
import { BlogPostService } from './blog-post.service';

import { PostRdo } from './rdo';
import { CreatePostDto } from './dto';
// import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    return this.blogPostService.getPost(id);
  }

  @Get('/')
  public async index() {
    const entities = await this.blogPostService.getAllPosts();
    const posts = entities.map((entity) => entity.toPOJO());
    return fillDto(PostRdo, posts);
  }

  @Post('/')
  public async create(@Body() dto: CreatePostDto): Promise<PostRdo> {
    const newPost = await this.blogPostService.createPost(dto);
    return fillDto(PostRdo, newPost.toPOJO());
  }
}
