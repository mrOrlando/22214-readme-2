import { Comment, Post } from '@project/types';
import { Entity } from '@project/helpers';
import { BlogTagEntity } from '../blog-tag/blog-tag.entity';
import { CreatePostDto } from './dto';

export class BlogPostEntity implements Post, Entity<string, Post> {
  public id?: string;
  public title!: string;
  public description!: string;
  public content!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public userId!: string;
  public tags!: BlogTagEntity[];
  public comments!: Comment[];

  public populate(data: Post): BlogPostEntity {
    this.id = data.id ?? undefined;
    this.title = data.title;
    this.description = data.description;
    this.content = data.content;
    this.updatedAt = data.updatedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.userId = data.userId;
    this.tags = data.tags.map((tag) => BlogTagEntity.fromObject(tag));
    this.comments = data.comments;

    return this;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      content: this.content,
      userId: this.userId,
      tags: this.tags.map((tagEntity) => tagEntity.toPOJO()),
      comments: this.comments,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public static fromObject(data: Post): BlogPostEntity {
    return new BlogPostEntity().populate(data);
  }

  public static fromDto(
    dto: CreatePostDto,
    tags: BlogTagEntity[]
  ): BlogPostEntity {
    const post = new BlogPostEntity();
    post.title = dto.title;
    post.description = dto.description;
    post.content = dto.content;
    post.userId = dto.userId;
    post.tags = tags;
    post.comments = [];

    return post;
  }
}
