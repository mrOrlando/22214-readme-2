import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationResult } from '@project/types';
import { BlogPostService } from '../blog-post/blog-post.service';
import { BlogCommentRepository } from './blog-comment.repository';
import { BlogCommentEntity } from './blog-comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { BlogCommentQuery } from './query/blog-comment.query';
import {
  COMMENT_FORBIDDEN_ERROR,
  COMMENT_NOT_FOUND_ERROR,
} from './blog-comment.constants';

@Injectable()
export class BlogCommentService {
  constructor(
    private readonly blogCommentRepository: BlogCommentRepository,
    private readonly blogPostService: BlogPostService
  ) {}

  public async getComment(id: string): Promise<BlogCommentEntity> {
    const comment = await this.blogCommentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException(COMMENT_NOT_FOUND_ERROR);
    }

    return comment;
  }

  public async getComments(
    postId: string,
    query: BlogCommentQuery
  ): Promise<PaginationResult<BlogCommentEntity>> {
    await this.blogPostService.getPublishedPost(postId);

    return this.blogCommentRepository.findByPostId(postId, query);
  }

  public async createComment(
    postId: string,
    dto: CreateCommentDto
  ): Promise<BlogCommentEntity> {
    await this.blogPostService.getPublishedPost(postId);

    const newComment = new BlogCommentEntity({
      message: dto.message,
      userId: dto.userId,
      postId,
    });

    return this.blogCommentRepository.save(newComment);
  }

  public async deleteComment(id: string, userId: string): Promise<void> {
    const comment = await this.getComment(id);
    if (comment.userId !== userId) {
      throw new ForbiddenException(COMMENT_FORBIDDEN_ERROR);
    }

    await this.blogCommentRepository.deleteById(id);
  }
}
