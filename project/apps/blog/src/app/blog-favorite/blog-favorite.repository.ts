import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { BlogFavoriteEntity } from './blog-favorite.entity';
import { Favorite } from '@project/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  FavoriteFilter,
  favoriteFilterToPrismaFilter,
} from './blog-favorite.filter';

@Injectable()
export class BlogFavoriteRepository extends BasePostgresRepository<
  BlogFavoriteEntity,
  Favorite
> {
  constructor(override readonly client: PrismaClientService) {
    super(client, BlogFavoriteEntity.fromObject);
  }

  override async findById(id: string): Promise<BlogFavoriteEntity | null> {
    const favorite = await this.client.favorite.findUnique({
      where: { id },
    });

    if (!favorite) {
      throw new NotFoundException(`Favorite with id ${id} not found.`);
    }

    return this.createEntityFromDocument(favorite);
  }

  public async find(filter?: FavoriteFilter): Promise<BlogFavoriteEntity[]> {
    const favorites = await this.client.favorite.findMany({
      where: favoriteFilterToPrismaFilter(filter),
    });

    return favorites
      .map((favorite) => this.createEntityFromDocument(favorite))
      .filter((favorite): favorite is BlogFavoriteEntity => favorite !== null);
  }

  public async postExists(postId: string): Promise<boolean> {
    const count = await this.client.post.count({
      where: { id: postId },
    });

    return count > 0;
  }

  override async save(entity: BlogFavoriteEntity): Promise<BlogFavoriteEntity> {
    const newFavorite = await this.client.favorite.create({
      data: {
        userId: entity.userId,
        postId: entity.postId,
      },
    });

    entity.id = newFavorite.id;
    entity.createdAt = newFavorite.createdAt;
    entity.updatedAt = newFavorite.updatedAt;

    return entity;
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.favorite.delete({
      where: { id },
    });
  }
}
