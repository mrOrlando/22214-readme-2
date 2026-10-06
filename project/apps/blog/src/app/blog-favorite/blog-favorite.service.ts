import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogFavoriteRepository } from './blog-favorite.repository';
import { BlogFavoriteEntity } from './blog-favorite.entity';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoriteFilter } from './blog-favorite.filter';

@Injectable()
export class BlogFavoriteService {
  constructor(
    private readonly blogFavoriteRepository: BlogFavoriteRepository
  ) {}

  public async getFavorite(id: string): Promise<BlogFavoriteEntity | null> {
    return this.blogFavoriteRepository.findById(id);
  }

  public async getAllFavorites(
    filter?: FavoriteFilter
  ): Promise<BlogFavoriteEntity[]> {
    return this.blogFavoriteRepository.find(filter);
  }

  public async createFavorite(
    dto: CreateFavoriteDto
  ): Promise<BlogFavoriteEntity> {
    const postExists = await this.blogFavoriteRepository.postExists(dto.postId);

    if (!postExists) {
      throw new NotFoundException(`Post with ID "${dto.postId}" not found`);
    }

    const existingFavorite = (
      await this.blogFavoriteRepository.find({
        postId: dto.postId,
        userId: dto.userId,
      })
    ).at(0);

    if (existingFavorite) {
      throw new ConflictException('Post is already in favorites of this user');
    }

    const newFavorite = new BlogFavoriteEntity({
      userId: dto.userId,
      postId: dto.postId,
    });
    await this.blogFavoriteRepository.save(newFavorite);

    return newFavorite;
  }

  public async deleteFavorite(id: string): Promise<void> {
    try {
      await this.blogFavoriteRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Favorite with ID "${id}" not found`);
    }
  }
}
