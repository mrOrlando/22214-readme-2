import { Expose } from 'class-transformer';

export class FavoriteRdo {
  @Expose()
  public id!: string;

  @Expose()
  public userId!: string;

  @Expose()
  public postId!: string;

  @Expose()
  public createdAt!: Date;
}
