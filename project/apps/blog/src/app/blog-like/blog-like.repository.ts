import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { Like } from '@project/types';
import { BlogLikeEntity } from './blog-like.entity';

@Injectable()
export class BlogLikeRepository extends BasePostgresRepository<
  BlogLikeEntity,
  Like
> {
  constructor(override readonly client: PrismaClientService) {
    super(client, BlogLikeEntity.fromObject);
  }

  public async findByPostAndUser(
    postId: string,
    userId: string
  ): Promise<BlogLikeEntity | null> {
    const like = await this.client.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    return this.createEntityFromDocument(like);
  }

  override async save(entity: BlogLikeEntity): Promise<BlogLikeEntity> {
    const newLike = await this.client.like.create({
      data: {
        userId: entity.userId,
        postId: entity.postId,
      },
    });

    return BlogLikeEntity.fromObject(newLike);
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.like.delete({
      where: { id },
    });
  }
}
