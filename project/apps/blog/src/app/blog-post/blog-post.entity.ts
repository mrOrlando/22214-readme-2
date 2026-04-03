import { Comment, Post } from '@project/types';
import { Entity } from '@project/helpers';
import { BlogCategoryEntity } from '../blog-category/blog-category.entity';
import { CreatePostDto } from './dto';

export class BlogPostEntity implements Post, Entity<string, Post> {
  public id?: string;
  public title!: string;
  public description!: string;
  public content!: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public userId!: string;
  public categories!: BlogCategoryEntity[];
  public comments!: Comment[];

  public populate(data: Post): BlogPostEntity {
    this.id = data.id ?? undefined;
    this.title = data.title;
    this.description = data.description;
    this.content = data.content;
    this.updatedAt = data.updatedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.userId = data.userId;
    this.categories = data.categories.map((category) =>
      BlogCategoryEntity.fromObject(category)
    );
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
      categories: this.categories.map((categoryEntity) =>
        categoryEntity.toPOJO()
      ),
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
    categories: BlogCategoryEntity[]
  ): BlogPostEntity {
    const post = new BlogPostEntity();
    post.title = dto.title;
    post.description = dto.description;
    post.content = dto.content;
    post.userId = dto.userId;
    post.categories = categories;
    post.comments = [];

    return post;
  }
}
