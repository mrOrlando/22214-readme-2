import { Comment, Post, PostContent, PostType } from '@project/types';
import { Entity } from '@project/helpers';
import { BlogTagEntity } from '../blog-tag/blog-tag.entity';
import { CreatePostDto } from './dto';

export class BlogPostEntity implements Post, Entity<string, Post> {
  public id?: string;
  public type!: PostType;
  public title?: string | null;
  public videoUrl?: string | null;
  public announcement?: string | null;
  public text?: string | null;
  public quoteText?: string | null;
  public quoteAuthor?: string | null;
  public photo?: string | null;
  public linkUrl?: string | null;
  public linkDescription?: string | null;
  public createdAt?: Date;
  public updatedAt?: Date;
  public userId!: string;
  public tags!: BlogTagEntity[];
  public comments!: Comment[];

  public populate(data: Post): BlogPostEntity {
    this.id = data.id ?? undefined;
    this.type = data.type;
    this.populateContent(data);
    this.updatedAt = data.updatedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.userId = data.userId;
    this.tags = data.tags.map((tag) => BlogTagEntity.fromObject(tag));
    this.comments = data.comments;

    return this;
  }

  public populateContent(data: PostContent): BlogPostEntity {
    this.title = data.title ?? null;
    this.videoUrl = data.videoUrl ?? null;
    this.announcement = data.announcement ?? null;
    this.text = data.text ?? null;
    this.quoteText = data.quoteText ?? null;
    this.quoteAuthor = data.quoteAuthor ?? null;
    this.photo = data.photo ?? null;
    this.linkUrl = data.linkUrl ?? null;
    this.linkDescription = data.linkDescription ?? null;

    return this;
  }

  public getContent(): Required<PostContent> {
    return {
      title: this.title ?? null,
      videoUrl: this.videoUrl ?? null,
      announcement: this.announcement ?? null,
      text: this.text ?? null,
      quoteText: this.quoteText ?? null,
      quoteAuthor: this.quoteAuthor ?? null,
      photo: this.photo ?? null,
      linkUrl: this.linkUrl ?? null,
      linkDescription: this.linkDescription ?? null,
    };
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      ...this.getContent(),
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
    post.type = dto.type;
    post.populateContent(dto);
    post.userId = dto.userId;
    post.tags = tags;
    post.comments = [];

    return post;
  }
}
