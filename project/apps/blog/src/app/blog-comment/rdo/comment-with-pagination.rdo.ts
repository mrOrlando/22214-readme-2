import { Expose, Type } from 'class-transformer';
import { PaginationRdo } from '../../common';
import { CommentRdo } from './comment.rdo';

export class CommentWithPaginationRdo extends PaginationRdo {
  @Expose()
  @Type(() => CommentRdo)
  public entities!: CommentRdo[];
}
