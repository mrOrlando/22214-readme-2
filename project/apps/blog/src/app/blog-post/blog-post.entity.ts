import { Post, PostContent, PostStatus, PostType } from '@project/types';
import { Entity } from '@project/helpers';
import { BlogTagEntity } from '../blog-tag/blog-tag.entity';
import { CreatePostDto } from './dto';
import { POST_CONTENT_FIELDS, POST_TYPE_FIELDS } from './blog-post.constants';

export class BlogPostEntity implements Post, Entity<string, Post> {
  public id?: string;
  public type!: PostType;
  public status?: PostStatus;
  public publishedAt?: Date;
  public isRepost = false;
  public originalPostId?: string | null;
  public originalUserId?: string | null;
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
  public likesCount = 0;
  public commentsCount = 0;

  public populate(data: Post): BlogPostEntity {
    this.id = data.id ?? undefined;
    this.type = data.type;
    this.status = data.status ?? undefined;
    this.publishedAt = data.publishedAt ?? undefined;
    this.isRepost = data.isRepost ?? false;
    this.originalPostId = data.originalPostId ?? null;
    this.originalUserId = data.originalUserId ?? null;
    this.populateContent(data);
    this.updatedAt = data.updatedAt ?? undefined;
    this.createdAt = data.createdAt ?? undefined;
    this.userId = data.userId;
    this.tags = data.tags.map((tag) => BlogTagEntity.fromObject(tag));
    this.likesCount = data.likesCount ?? 0;
    this.commentsCount = data.commentsCount ?? 0;

    return this;
  }

  // Keeps only the fields that belong to the post type
  public populateContent(data: PostContent): BlogPostEntity {
    const typeFields = POST_TYPE_FIELDS[this.type];

    for (const field of POST_CONTENT_FIELDS) {
      this[field] = typeFields.includes(field) ? data[field] ?? null : null;
    }

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

  // A short text that describes the post in notifications
  public getDisplayTitle(): string {
    const MAX_LENGTH = 100;
    const title =
      this.title ||
      this.quoteText ||
      this.linkDescription ||
      this.linkUrl ||
      this.videoUrl ||
      this.photo ||
      this.type;

    return title.slice(0, MAX_LENGTH);
  }

  public isPublished(): boolean {
    return this.status === PostStatus.Published;
  }

  public toPOJO(): Post {
    return {
      id: this.id,
      type: this.type,
      status: this.status,
      publishedAt: this.publishedAt,
      isRepost: this.isRepost,
      originalPostId: this.originalPostId ?? null,
      originalUserId: this.originalUserId ?? null,
      ...this.getContent(),
      userId: this.userId,
      tags: this.tags.map((tagEntity) => tagEntity.toPOJO()),
      likesCount: this.likesCount,
      commentsCount: this.commentsCount,
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
    post.status = dto.status;
    post.populateContent(dto);
    post.userId = dto.userId;
    post.tags = tags;

    return post;
  }

  public static fromOriginal(
    original: BlogPostEntity,
    userId: string
  ): BlogPostEntity {
    const repost = new BlogPostEntity();
    repost.type = original.type;
    repost.populateContent(original);
    repost.userId = userId;
    repost.isRepost = true;
    repost.originalPostId = original.originalPostId ?? original.id;
    repost.originalUserId = original.originalUserId ?? original.userId;
    repost.tags = original.tags;

    return repost;
  }
}
