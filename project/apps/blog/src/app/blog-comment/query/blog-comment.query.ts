import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import {
  DEFAULT_COMMENT_COUNT_LIMIT,
  DEFAULT_COMMENT_PAGE_COUNT,
} from '../blog-comment.constants';

export class BlogCommentQuery {
  @ApiProperty({
    description: 'Number of comments per page',
    required: false,
    default: DEFAULT_COMMENT_COUNT_LIMIT,
    minimum: 1,
    maximum: DEFAULT_COMMENT_COUNT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(DEFAULT_COMMENT_COUNT_LIMIT)
  public limit: number = DEFAULT_COMMENT_COUNT_LIMIT;

  @ApiProperty({
    description: 'Page number',
    required: false,
    default: DEFAULT_COMMENT_PAGE_COUNT,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page: number = DEFAULT_COMMENT_PAGE_COUNT;
}
