import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { BlogLikeEntity } from './blog-like.entity';
import { Like } from '@project/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { LikeFilter, likeFilterToPrismaFilter } from './blog-like.filter';

@Injectable()
export class BlogLikeRepository extends BasePostgresRepository<
  BlogLikeEntity,
  Like
> {
  constructor(override readonly client: PrismaClientService) {
    super(client, BlogLikeEntity.fromObject);
  }

  override async findById(id: string): Promise<BlogLikeEntity | null> {
    const like = await this.client.like.findUnique({
      where: { id },
    });

    if (!like) {
      throw new NotFoundException(`Like with id ${id} not found.`);
    }

    return this.createEntityFromDocument(like);
  }

  public async find(filter?: LikeFilter): Promise<BlogLikeEntity[]> {
    const likes = await this.client.like.findMany({
      where: likeFilterToPrismaFilter(filter),
    });

    return likes
      .map((like) => this.createEntityFromDocument(like))
      .filter((like): like is BlogLikeEntity => like !== null);
  }

  public async postExists(postId: string): Promise<boolean> {
    const count = await this.client.post.count({
      where: { id: postId },
    });

    return count > 0;
  }

  override async save(entity: BlogLikeEntity): Promise<BlogLikeEntity> {
    const newLike = await this.client.like.create({
      data: {
        userId: entity.userId,
        postId: entity.postId,
      },
    });

    entity.id = newLike.id;
    entity.createdAt = newLike.createdAt;
    entity.updatedAt = newLike.updatedAt;

    return entity;
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.like.delete({
      where: { id },
    });
  }
}
