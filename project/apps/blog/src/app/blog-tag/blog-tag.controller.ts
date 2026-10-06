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
import { BlogTagService } from './blog-tag.service';
import { fillDto } from '@project/helpers';

import { TagRdo } from './rdo';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class BlogTagController {
  constructor(private readonly blogTagService: BlogTagService) {}

  @Get('/:id')
  public async show(@Param('id') id: string) {
    return this.blogTagService.getTag(id);
  }

  @Get('/')
  public async index() {
    const entities = await this.blogTagService.getAllTags();
    const tags = entities.map((entity) => entity.toPOJO());
    return fillDto(TagRdo, tags);
  }

  @Post('/')
  public async create(@Body() dto: CreateTagDto): Promise<TagRdo> {
    const newTag = await this.blogTagService.createTag(dto);
    return fillDto(TagRdo, newTag.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id') id: string): Promise<void> {
    await this.blogTagService.deleteTag(id);
  }

  @Patch('/:id')
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdateTagDto
  ): Promise<TagRdo> {
    const updatedTag = await this.blogTagService.updateTag(id, dto);
    return fillDto(TagRdo, updatedTag.toPOJO());
  }
}
