import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PostRdo } from './post.rdo';

export class PostsWithPaginationRdo {
  @ApiProperty({ type: [PostRdo] })
  @Expose()
  @Type(() => PostRdo)
  public entities!: PostRdo[];

  @ApiProperty({ description: 'Total number of pages', example: 4 })
  @Expose()
  public totalPages!: number;

  @ApiProperty({ description: 'Total number of posts', example: 87 })
  @Expose()
  public totalItems!: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  @Expose()
  public currentPage!: number;

  @ApiProperty({ description: 'Posts per page', example: 25 })
  @Expose()
  public itemsPerPage!: number;
}
