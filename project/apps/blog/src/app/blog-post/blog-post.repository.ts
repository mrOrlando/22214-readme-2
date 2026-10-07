import * as Prisma from '@project/models';
import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { BlogPostEntity } from './blog-post.entity';
import { PaginationResult, Post, PostStatus } from '@project/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PostFilter, postFilterToPrismaFilter } from './blog-post.filter';
import { BlogPostQuery } from './query';
import { PostSortType } from './blog-post.constants';

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

  override async findById(id: string): Promise<BlogPostEntity | null> {
    const post = await this.client.post.findUnique({
      where: { id },
      include: {
        tags: true,
        comments: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return this.createEntityFromDocument(post);
  }

  public async find(filter?: PostFilter): Promise<BlogPostEntity[]> {
    const posts = await this.client.post.findMany({
      where: postFilterToPrismaFilter(filter),
      include: {
        tags: true,
        comments: true,
      },
    });

    return posts
      .map((post) => this.createEntityFromDocument(post))
      .filter((post): post is BlogPostEntity => post !== null);
  }

  public async findPage(
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
        include: {
          tags: true,
          comments: true,
          _count: { select: { likes: true, comments: true } },
        },
      }),
      this.client.post.count({ where }),
    ]);

    return {
      entities: posts.map(({ _count, ...post }) =>
        BlogPostEntity.fromObject({
          ...post,
          likesCount: _count.likes,
          commentsCount: _count.comments,
        })
      ),
      currentPage: query.page,
      totalPages: Math.ceil(totalItems / query.limit),
      itemsPerPage: query.limit,
      totalItems,
    };
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
      include: {
        tags: true,
        comments: true,
      },
    });

    return entity.populate(newPost);
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
      include: {
        tags: true,
        comments: true,
      },
    });

    return entity.populate(updatedPost);
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.post.delete({
      where: { id },
    });
  }
}
