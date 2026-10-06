import { Like } from '@project/types';
import { Entity } from '@project/helpers';

export class BlogLikeEntity implements Like, Entity<string, Like> {
  public id?: string;
  public userId!: string;
  public postId!: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: Like) {
    if (!data.userId) {
      throw new Error('Like userId is required');
    }

    if (!data.postId) {
      throw new Error('Like postId is required');
    }

    this.populate(data);
  }

  public populate(data: Like): void {
    this.id = data.id ?? undefined;
    this.userId = data.userId;
    this.postId = data.postId;
    this.updatedAt = data.updatedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
  }

  public toPOJO(): Like {
    return {
      id: this.id,
      userId: this.userId,
      postId: this.postId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromObject(data: Like): BlogLikeEntity {
    return new BlogLikeEntity(data);
  }
}
