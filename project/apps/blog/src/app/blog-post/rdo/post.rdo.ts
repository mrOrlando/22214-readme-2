import { Tag, Comment } from '@project/types';
import { Expose } from 'class-transformer';

export class PostRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public content!: string;

  @Expose()
  public userId!: string;

  @Expose()
  public tags!: Tag[];

  @Expose()
  public comments!: Comment[];
}
