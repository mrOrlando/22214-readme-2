import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginationRdo } from '../../common';
import { PostRdo } from './post.rdo';

export class PostWithPaginationRdo extends PaginationRdo {
  @ApiProperty({ description: 'Posts of the current page', type: [PostRdo] })
  @Expose()
  @Type(() => PostRdo)
  public entities!: PostRdo[];
}
