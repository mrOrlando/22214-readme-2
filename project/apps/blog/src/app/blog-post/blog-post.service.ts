import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationResult, PostContent } from '@project/types';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostEntity } from './blog-post.entity';
import { BlogTagService } from '../blog-tag/blog-tag.service';
import { CreatePostDto, UpdatePostDto } from './dto';
import { BlogPostQuery } from './query';
import {
  POST_ALREADY_REPOSTED_ERROR,
  POST_CONTENT_FIELDS,
  POST_FORBIDDEN_ERROR,
  POST_NOT_FOUND_ERROR,
} from './blog-post.constants';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly blogTagService: BlogTagService
  ) {}

  public async getPost(id: string): Promise<BlogPostEntity> {
    const post = await this.blogPostRepository.findById(id);
    if (!post) {
      throw new NotFoundException(POST_NOT_FOUND_ERROR);
    }

    return post;
  }

  public async getPublishedPost(id: string): Promise<BlogPostEntity> {
    const post = await this.getPost(id);
    if (!post.isPublished()) {
      throw new NotFoundException(POST_NOT_FOUND_ERROR);
    }

    return post;
  }

  public async getPosts(
    query: BlogPostQuery
  ): Promise<PaginationResult<BlogPostEntity>> {
    return this.blogPostRepository.find(query);
  }

  public async getDrafts(userId: string): Promise<BlogPostEntity[]> {
    return this.blogPostRepository.findDrafts(userId);
  }

  public async searchPosts(title: string): Promise<BlogPostEntity[]> {
    const words = title.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      return [];
    }

    return this.blogPostRepository.searchByTitle(words);
  }

  public async createPost(dto: CreatePostDto): Promise<BlogPostEntity> {
    const tags = await this.blogTagService.getOrCreateTagsByTitles(dto.tags);
    const newPost = BlogPostEntity.fromDto(dto, tags);

    return this.blogPostRepository.save(newPost);
  }

  public async repostPost(id: string, userId: string): Promise<BlogPostEntity> {
    const originalPost = await this.getPublishedPost(id);
    const repost = BlogPostEntity.fromOriginal(originalPost, userId);

    const existingRepost = await this.blogPostRepository.findRepost(
      userId,
      `${repost.originalPostId}`
    );
    if (existingRepost) {
      throw new ConflictException(POST_ALREADY_REPOSTED_ERROR);
    }

    return this.blogPostRepository.save(repost);
  }

  public async deletePost(id: string, userId: string): Promise<void> {
    await this.getOwnPost(id, userId);
    await this.blogPostRepository.deleteById(id);
  }

  public async updatePost(
    id: string,
    dto: UpdatePostDto
  ): Promise<BlogPostEntity> {
    const existingPost = await this.getOwnPost(id, dto.userId);

    if (dto.tags) {
      existingPost.tags = await this.blogTagService.getOrCreateTagsByTitles(
        dto.tags
      );
    }

    existingPost.status = dto.status ?? existingPost.status;
    existingPost.publishedAt = dto.publishedAt
      ? new Date(dto.publishedAt)
      : existingPost.publishedAt;

    const content: PostContent = existingPost.getContent();
    for (const field of POST_CONTENT_FIELDS) {
      content[field] = dto[field] ?? content[field];
    }
    existingPost.populateContent(content);

    return this.blogPostRepository.update(id, existingPost);
  }

  private async getOwnPost(
    id: string,
    userId: string
  ): Promise<BlogPostEntity> {
    const post = await this.getPost(id);
    if (post.userId !== userId) {
      throw new ForbiddenException(POST_FORBIDDEN_ERROR);
    }

    return post;
  }
}
