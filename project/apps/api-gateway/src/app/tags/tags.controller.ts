import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { fillDto } from '@project/helpers';
import { BlogClient } from '../clients/blog.client';
import { TagRdo } from './tag.rdo';

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly blogClient: BlogClient) {}

  @ApiOperation({ summary: 'Get tags of the posts' })
  @ApiResponse({ status: HttpStatus.OK, type: [TagRdo] })
  @Get('/')
  public async index(): Promise<TagRdo[]> {
    const tags = await this.blogClient.getTags();
    return tags.map((tag) => fillDto(TagRdo, tag));
  }
}
