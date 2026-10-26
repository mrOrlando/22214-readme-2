import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CommentRdo } from './comment.rdo';

export class CommentsWithPaginationRdo {
  @ApiProperty({ type: [CommentRdo] })
  @Expose()
  @Type(() => CommentRdo)
  public entities!: CommentRdo[];

  @ApiProperty({ description: 'Total number of pages', example: 2 })
  @Expose()
  public totalPages!: number;

  @ApiProperty({ description: 'Total number of comments', example: 63 })
  @Expose()
  public totalItems!: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  @Expose()
  public currentPage!: number;

  @ApiProperty({ description: 'Comments per page', example: 50 })
  @Expose()
  public itemsPerPage!: number;
}
