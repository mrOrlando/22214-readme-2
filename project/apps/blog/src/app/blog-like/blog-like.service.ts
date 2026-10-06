import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogLikeRepository } from './blog-like.repository';
import { BlogLikeEntity } from './blog-like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { LikeFilter } from './blog-like.filter';

@Injectable()
export class BlogLikeService {
  constructor(private readonly blogLikeRepository: BlogLikeRepository) {}

  public async getLike(id: string): Promise<BlogLikeEntity | null> {
    return this.blogLikeRepository.findById(id);
  }

  public async getAllLikes(filter?: LikeFilter): Promise<BlogLikeEntity[]> {
    return this.blogLikeRepository.find(filter);
  }

  public async createLike(dto: CreateLikeDto): Promise<BlogLikeEntity> {
    const postExists = await this.blogLikeRepository.postExists(dto.postId);

    if (!postExists) {
      throw new NotFoundException(`Post with ID "${dto.postId}" not found`);
    }

    const existingLike = (
      await this.blogLikeRepository.find({
        postId: dto.postId,
        userId: dto.userId,
      })
    ).at(0);

    if (existingLike) {
      throw new ConflictException('Post is already liked by this user');
    }

    const newLike = new BlogLikeEntity({
      userId: dto.userId,
      postId: dto.postId,
    });
    await this.blogLikeRepository.save(newLike);

    return newLike;
  }

  public async deleteLike(id: string): Promise<void> {
    try {
      await this.blogLikeRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Like with ID "${id}" not found`);
    }
  }
}
