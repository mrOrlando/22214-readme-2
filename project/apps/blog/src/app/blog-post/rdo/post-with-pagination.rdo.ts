import { Expose, Type } from 'class-transformer';
import { PaginationRdo } from '../../common';
import { PostRdo } from './post.rdo';

export class PostWithPaginationRdo extends PaginationRdo {
  @Expose()
  @Type(() => PostRdo)
  public entities!: PostRdo[];
}
