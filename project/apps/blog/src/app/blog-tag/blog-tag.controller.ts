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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import { BlogTagService } from './blog-tag.service';
import { TagRdo } from './rdo';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('tags')
@Controller('tags')
export class BlogTagController {
  constructor(private readonly blogTagService: BlogTagService) {}

  @ApiOperation({ summary: 'Get a tag' })
  @ApiParam({ name: 'id', description: 'Tag ID (UUID)' })
  @ApiResponse({ status: HttpStatus.OK, type: TagRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'The tag ID is not a valid UUID.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The tag with this ID not found.',
  })
  @Get('/:id')
  public async show(@Param('id', ParseUUIDPipe) id: string): Promise<TagRdo> {
    const tag = await this.blogTagService.getTag(id);
    return fillDto(TagRdo, tag?.toPOJO());
  }

  @ApiOperation({ summary: 'Get tags' })
  @ApiResponse({ status: HttpStatus.OK, type: [TagRdo] })
  @Get('/')
  public async index(): Promise<TagRdo[]> {
    const entities = await this.blogTagService.getAllTags();
    return entities.map((entity) => fillDto(TagRdo, entity.toPOJO()));
  }

  @ApiOperation({ summary: 'Create a tag' })
  @ApiResponse({ status: HttpStatus.CREATED, type: TagRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The tag with this title already exists.',
  })
  @Post('/')
  public async create(@Body() dto: CreateTagDto): Promise<TagRdo> {
    const newTag = await this.blogTagService.createTag(dto);
    return fillDto(TagRdo, newTag.toPOJO());
  }

  @ApiOperation({ summary: 'Delete a tag' })
  @ApiParam({ name: 'id', description: 'Tag ID (UUID)' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The tag with this ID not found.',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async destroy(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.blogTagService.deleteTag(id);
  }

  @ApiOperation({ summary: 'Rename a tag' })
  @ApiParam({ name: 'id', description: 'Tag ID (UUID)' })
  @ApiResponse({ status: HttpStatus.OK, type: TagRdo })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'The tag with this ID not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'The tag with this title already exists.',
  })
  @Patch('/:id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTagDto
  ): Promise<TagRdo> {
    const updatedTag = await this.blogTagService.updateTag(id, dto);
    return fillDto(TagRdo, updatedTag.toPOJO());
  }
}
