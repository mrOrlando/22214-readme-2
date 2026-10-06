import { Favorite } from '@project/types';
import { Entity } from '@project/helpers';

export class BlogFavoriteEntity implements Favorite, Entity<string, Favorite> {
  public id?: string;
  public userId!: string;
  public postId!: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: Favorite) {
    if (!data.userId) {
      throw new Error('Favorite userId is required');
    }

    if (!data.postId) {
      throw new Error('Favorite postId is required');
    }

    this.populate(data);
  }

  public populate(data: Favorite): void {
    this.id = data.id ?? undefined;
    this.userId = data.userId;
    this.postId = data.postId;
    this.updatedAt = data.updatedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
  }

  public toPOJO(): Favorite {
    return {
      id: this.id,
      userId: this.userId,
      postId: this.postId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromObject(data: Favorite): BlogFavoriteEntity {
    return new BlogFavoriteEntity(data);
  }
}
