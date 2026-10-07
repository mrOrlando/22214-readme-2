import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { PostType } from '@project/types';
import {
  DEFAULT_PAGE_COUNT,
  DEFAULT_POST_COUNT_LIMIT,
  PostSortType,
} from '../blog-post.constants';

export class BlogPostQuery {
  @ApiProperty({
    description: 'Number of posts per page',
    required: false,
    default: DEFAULT_POST_COUNT_LIMIT,
    minimum: 1,
    maximum: DEFAULT_POST_COUNT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(DEFAULT_POST_COUNT_LIMIT)
  public limit: number = DEFAULT_POST_COUNT_LIMIT;

  @ApiProperty({
    description: 'Page number',
    required: false,
    default: DEFAULT_PAGE_COUNT,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page: number = DEFAULT_PAGE_COUNT;

  @ApiProperty({
    description:
      'Sorting, always descending: by publication date, likes or comments',
    required: false,
    enum: Object.values(PostSortType),
    default: PostSortType.Date,
  })
  @IsOptional()
  @IsIn(Object.values(PostSortType))
  public sortBy: PostSortType = PostSortType.Date;

  @ApiProperty({
    description: 'Return only posts of this author',
    required: false,
    example: '658170cbb954e9f5b905ccf4',
  })
  @IsOptional()
  @IsMongoId()
  public userId?: string;

  @ApiProperty({
    description: 'Return only posts of this type',
    required: false,
    enum: Object.values(PostType),
  })
  @IsOptional()
  @IsIn(Object.values(PostType))
  public type?: PostType;

  @ApiProperty({
    description: 'Return only posts with this tag',
    required: false,
    example: 'books',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value
  )
  public tag?: string;
}
