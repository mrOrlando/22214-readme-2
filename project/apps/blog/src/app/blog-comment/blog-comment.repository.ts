import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { Comment, PaginationResult } from '@project/types';
import { BlogCommentEntity } from './blog-comment.entity';
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

    return this.createEntityFromDocument(comment);
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

  override async save(entity: BlogCommentEntity): Promise<BlogCommentEntity> {
    const newComment = await this.client.comment.create({
      data: {
        message: entity.message,
        userId: entity.userId,
        postId: entity.postId,
      },
    });

    return BlogCommentEntity.fromObject(newComment);
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.comment.delete({
      where: { id },
    });
  }
}
