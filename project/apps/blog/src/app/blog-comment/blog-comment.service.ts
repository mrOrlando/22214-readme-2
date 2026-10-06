import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogCommentRepository } from './blog-comment.repository';
import { BlogCommentEntity } from './blog-comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class BlogCommentService {
  constructor(
    private readonly blogCommentRepository: BlogCommentRepository
  ) {}

  public async getComment(id: string): Promise<BlogCommentEntity | null> {
    return this.blogCommentRepository.findById(id);
  }

  public async getAllComments(): Promise<BlogCommentEntity[]> {
    return this.blogCommentRepository.find();
  }

  public async createComment(
    dto: CreateCommentDto
  ): Promise<BlogCommentEntity> {
    const postExists = await this.blogCommentRepository.postExists(dto.postId);

    if (!postExists) {
      throw new NotFoundException(`Post with ID "${dto.postId}" not found`);
    }

    const newComment = new BlogCommentEntity({
      message: dto.message,
      userId: dto.userId,
      postId: dto.postId,
    });
    await this.blogCommentRepository.save(newComment);

    return newComment;
  }

  public async deleteComment(id: string): Promise<void> {
    try {
      await this.blogCommentRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
  }

  public async updateComment(
    id: string,
    dto: UpdateCommentDto
  ): Promise<BlogCommentEntity> {
    try {
      const existing = await this.blogCommentRepository.findById(id);
      if (!existing) {
        throw new NotFoundException(`Comment with ID "${id}" not found`);
      }

      const entity = new BlogCommentEntity({
        ...existing.toPOJO(),
        message: dto.message,
      });

      return await this.blogCommentRepository.update(id, entity);
    } catch {
      throw new NotFoundException(`Comment with ID "${id}" not found`);
    }
  }
}
