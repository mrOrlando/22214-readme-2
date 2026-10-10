import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginationRdo } from '../../common';
import { CommentRdo } from './comment.rdo';

export class CommentWithPaginationRdo extends PaginationRdo {
  @ApiProperty({
    description: 'Comments of the current page',
    type: [CommentRdo],
  })
  @Expose()
  @Type(() => CommentRdo)
  public entities!: CommentRdo[];
}
