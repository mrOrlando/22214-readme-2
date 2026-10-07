import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PaginationRdo {
  @ApiProperty({ description: 'Total number of pages', example: 4 })
  @Expose()
  public totalPages!: number;

  @ApiProperty({ description: 'Total number of items', example: 87 })
  @Expose()
  public totalItems!: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  @Expose()
  public currentPage!: number;

  @ApiProperty({ description: 'Number of items per page', example: 25 })
  @Expose()
  public itemsPerPage!: number;
}
