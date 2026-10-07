import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { BlogCommentEntity } from './blog-comment.entity';
import { Comment, PaginationResult } from '@project/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CommentFilter,
  commentFilterToPrismaFilter,
} from './blog-comment.filter';
import { MAX_COMMENTS_LIMIT } from './blog-comment.constants';
import { BlogCommentQuery } from './query/blog-comment.query';

@Injectable()
export class BlogCommentRepository extends BasePostgresRepository<
  BlogCommentEntity,
  Comment
> {
  constructor(override readonly client: PrismaClientService) {
    super(client, BlogCommentEntity.fromObject);
  }

  override async findById(id: string): Promise<BlogCommentEntity | null> {
    const comment = await this.client.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with id ${id} not found.`);
    }

    return this.createEntityFromDocument(comment);
  }

  public async find(filter?: CommentFilter): Promise<BlogCommentEntity[]> {
    const comments = await this.client.comment.findMany({
      where: commentFilterToPrismaFilter(filter),
      take: MAX_COMMENTS_LIMIT,
    });

    return comments
      .map((comment) => this.createEntityFromDocument(comment))
      .filter((comment): comment is BlogCommentEntity => comment !== null);
  }

  public async findByPostId(
    postId: string,
    query: BlogCommentQuery
  ): Promise<PaginationResult<BlogCommentEntity>> {
    const where = { postId };

    const [comments, totalItems] = await Promise.all([
      this.client.comment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.client.comment.count({ where }),
    ]);

    return {
      entities: comments.map((comment) =>
        BlogCommentEntity.fromObject(comment)
      ),
      currentPage: query.page,
      totalPages: Math.ceil(totalItems / query.limit),
      itemsPerPage: query.limit,
      totalItems,
    };
  }

  public async postExists(postId: string): Promise<boolean> {
    const count = await this.client.post.count({
      where: { id: postId },
    });

    return count > 0;
  }

  override async save(entity: BlogCommentEntity): Promise<BlogCommentEntity> {
    const newComment = await this.client.comment.create({
      data: {
        message: entity.message,
        userId: entity.userId,
        postId: entity.postId,
      },
    });

    entity.id = newComment.id;
    entity.createdAt = newComment.createdAt;
    entity.updatedAt = newComment.updatedAt;

    return entity;
  }

  override async update(
    id: string,
    entity: BlogCommentEntity
  ): Promise<BlogCommentEntity> {
    const updatedComment = await this.client.comment.update({
      where: { id },
      data: {
        message: entity.message,
      },
    });

    const updatedEntity = this.createEntityFromDocument(updatedComment);
    if (!updatedEntity) {
      throw new NotFoundException(`Comment with id ${id} not found.`);
    }

    return updatedEntity;
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.comment.delete({
      where: { id },
    });
  }
}
