import { Comment } from '@project/types';
import { Entity } from '@project/helpers';

export class BlogCommentEntity implements Comment, Entity<string, Comment> {
  public id?: string;
  public message!: string;
  public userId!: string;
  public postId!: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(data: Comment) {
    if (!data.message) {
      throw new Error('Comment message is required');
    }

    if (!data.userId) {
      throw new Error('Comment userId is required');
    }

    if (!data.postId) {
      throw new Error('Comment postId is required');
    }

    this.populate(data);
  }

  public populate(data: Comment): void {
    this.id = data.id ?? undefined;
    this.message = data.message;
    this.userId = data.userId;
    this.postId = data.postId ?? '';
    this.updatedAt = data.updatedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
  }

  public toPOJO(): Comment {
    return {
      id: this.id,
      message: this.message,
      userId: this.userId,
      postId: this.postId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromObject(data: Comment): BlogCommentEntity {
    return new BlogCommentEntity(data);
  }
}
