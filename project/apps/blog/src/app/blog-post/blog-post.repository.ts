import { Injectable } from '@nestjs/common';
import * as Prisma from '@project/models';
import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { PaginationResult, Post, PostStatus } from '@project/types';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostQuery } from './query';
import { PostSortType } from './blog-post.constants';

const POST_INCLUDE = {
  tags: true,
  _count: {
    select: {
      likes: true,
      comments: true,
    },
  },
} satisfies Prisma.PostInclude;

type PostRecord = Prisma.PostGetPayload<{ include: typeof POST_INCLUDE }>;

const POST_ORDER_BY: Record<
  PostSortType,
  Prisma.PostOrderByWithRelationInput[]
> = {
  [PostSortType.Date]: [{ publishedAt: 'desc' }],
  [PostSortType.Likes]: [
    { likes: { _count: 'desc' } },
    { publishedAt: 'desc' },
  ],
  [PostSortType.Comments]: [
    { comments: { _count: 'desc' } },
    { publishedAt: 'desc' },
  ],
};

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<
  BlogPostEntity,
  Post
> {
  constructor(override readonly client: PrismaClientService) {
    super(client, BlogPostEntity.fromObject);
  }

  private createEntityFromRecord({
    _count,
    ...post
  }: PostRecord): BlogPostEntity {
    return BlogPostEntity.fromObject({
      ...post,
      likesCount: _count.likes,
      commentsCount: _count.comments,
    });
  }

  override async findById(id: string): Promise<BlogPostEntity | null> {
    const post = await this.client.post.findUnique({
      where: { id },
      include: POST_INCLUDE,
    });

    return post ? this.createEntityFromRecord(post) : null;
  }

  public async find(
    query: BlogPostQuery
  ): Promise<PaginationResult<BlogPostEntity>> {
    const where: Prisma.PostWhereInput = {
      status: PostStatus.Published,
      userId: query.userId,
      type: query.type,
      tags: query.tag ? { some: { title: query.tag } } : undefined,
    };

    const [posts, totalItems] = await Promise.all([
      this.client.post.findMany({
        where,
        orderBy: POST_ORDER_BY[query.sortBy],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: POST_INCLUDE,
      }),
      this.client.post.count({ where }),
    ]);

    return {
      entities: posts.map((post) => this.createEntityFromRecord(post)),
      currentPage: query.page,
      totalPages: Math.ceil(totalItems / query.limit),
      itemsPerPage: query.limit,
      totalItems,
    };
  }

  public async findRepost(
    userId: string,
    originalPostId: string
  ): Promise<BlogPostEntity | null> {
    const post = await this.client.post.findUnique({
      where: { userId_originalPostId: { userId, originalPostId } },
      include: POST_INCLUDE,
    });

    return post ? this.createEntityFromRecord(post) : null;
  }

  override async save(entity: BlogPostEntity): Promise<BlogPostEntity> {
    const newPost = await this.client.post.create({
      data: {
        type: entity.type,
        status: entity.status,
        publishedAt: entity.publishedAt,
        ...entity.getContent(),
        userId: entity.userId,
        isRepost: entity.isRepost,
        originalPostId: entity.originalPostId,
        originalUserId: entity.originalUserId,
        tags: {
          connect: entity.tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: POST_INCLUDE,
    });

    return this.createEntityFromRecord(newPost);
  }

  override async update(
    id: string,
    entity: BlogPostEntity
  ): Promise<BlogPostEntity> {
    const updatedPost = await this.client.post.update({
      where: { id },
      data: {
        status: entity.status,
        publishedAt: entity.publishedAt,
        ...entity.getContent(),
        tags: {
          set: entity.tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: POST_INCLUDE,
    });

    return this.createEntityFromRecord(updatedPost);
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.post.delete({
      where: { id },
    });
  }
}
