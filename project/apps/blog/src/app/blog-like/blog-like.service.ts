import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogPostService } from '../blog-post/blog-post.service';
import { BlogLikeRepository } from './blog-like.repository';
import { BlogLikeEntity } from './blog-like.entity';
import { LIKE_EXISTS_ERROR, LIKE_NOT_FOUND_ERROR } from './blog-like.constants';

@Injectable()
export class BlogLikeService {
  constructor(
    private readonly blogLikeRepository: BlogLikeRepository,
    private readonly blogPostService: BlogPostService
  ) {}

  public async likePost(
    postId: string,
    userId: string
  ): Promise<BlogLikeEntity> {
    await this.blogPostService.getPublishedPost(postId);

    const existingLike = await this.blogLikeRepository.findByPostAndUser(
      postId,
      userId
    );
    if (existingLike) {
      throw new ConflictException(LIKE_EXISTS_ERROR);
    }

    return this.blogLikeRepository.save(new BlogLikeEntity({ postId, userId }));
  }

  public async unlikePost(postId: string, userId: string): Promise<void> {
    const existingLike = await this.blogLikeRepository.findByPostAndUser(
      postId,
      userId
    );
    if (!existingLike) {
      throw new NotFoundException(LIKE_NOT_FOUND_ERROR);
    }

    await this.blogLikeRepository.deleteById(`${existingLike.id}`);
  }
}
