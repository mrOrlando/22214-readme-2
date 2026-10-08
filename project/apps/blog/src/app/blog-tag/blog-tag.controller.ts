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
} from '@nestjs/common';
import { fillDto } from '@project/helpers';
import { BlogTagService } from './blog-tag.service';
import { TagRdo } from './rdo';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Controller('tags')
export class BlogTagController {
  constructor(private readonly blogTagService: BlogTagService) {}

  @Get('/:id')
  public async show(@Param('id', ParseUUIDPipe) id: string): Promise<TagRdo> {
    const tag = await this.blogTagService.getTag(id);
    return fillDto(TagRdo, tag?.toPOJO());
  }

  @Get('/')
  public async index(): Promise<TagRdo[]> {
    const entities = await this.blogTagService.getAllTags();
    return entities.map((entity) => fillDto(TagRdo, entity.toPOJO()));
  }

  @Post('/')
  public async create(@Body() dto: CreateTagDto): Promise<TagRdo> {
    const newTag = await this.blogTagService.createTag(dto);
    return fillDto(TagRdo, newTag.toPOJO());
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.blogTagService.deleteTag(id);
  }

  @Patch('/:id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTagDto
  ): Promise<TagRdo> {
    const updatedTag = await this.blogTagService.updateTag(id, dto);
    return fillDto(TagRdo, updatedTag.toPOJO());
  }
}
