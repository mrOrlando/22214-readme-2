import { Category, Comment, Post } from '@project/types';
import { Entity } from '@project/helpers';

export class BlogPostEntity implements Post, Entity<string, Post> {
  public id?: string;
  public title!: string;
  public description!: string;
  public content!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public userId!: string;
  public categories!: Category[];
  public comments!: Comment[];

  constructor(data: Post) {
    if (!data.title) {
      throw new Error('Post title is required');
    }

    if (!data.description) {
      throw new Error('Post description is required');
    }

    if (!data.userId) {
      throw new Error('Post userId is required');
    }

    if (!data.categories) {
      throw new Error('Post categories are required');
    }

    if (!data.comments) {
      throw new Error('Post comments are required');
    }

    this.populate(data);
  }

  public populate(data: Post): void {
    this.id = data.id ?? undefined;
    this.title = data.title;
    this.description = data.description;
    this.content = data.content;
    this.updatedAt = data.updatedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.userId = data.userId;
    this.categories = data.categories;
    this.comments = data.comments;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      content: this.content,
      userId: this.userId,
      categories: this.categories,
      comments: this.comments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromObject(data: Post): BlogPostEntity {
    return new BlogPostEntity(data);
  }
}
