import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostEntity } from './blog-post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogTagService } from '../blog-tag/blog-tag.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreateRepostDto } from './dto/create-repost.dto';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly blogTagService: BlogTagService
  ) {}

  public async getPost(id: string): Promise<BlogPostEntity | null> {
    return this.blogPostRepository.findById(id);
  }

  public async getAllPosts(): Promise<BlogPostEntity[]> {
    return this.blogPostRepository.find();
  }

  public async createPost(dto: CreatePostDto): Promise<BlogPostEntity> {
    const tags = await this.blogTagService.getOrCreateTagsByTitles(dto.tags);
    const newPost = BlogPostEntity.fromDto(dto, tags);

    return this.blogPostRepository.save(newPost);
  }

  public async repostPost(
    id: string,
    dto: CreateRepostDto
  ): Promise<BlogPostEntity> {
    const originalPost = await this.blogPostRepository.findById(id);
    if (!originalPost) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    const repost = BlogPostEntity.fromOriginal(originalPost, dto.userId);
    const existingRepost = (
      await this.blogPostRepository.find({
        userId: dto.userId,
        originalPostId: repost.originalPostId ?? undefined,
      })
    ).at(0);

    if (existingRepost) {
      throw new ConflictException('Post is already reposted by this user');
    }

    return this.blogPostRepository.save(repost);
  }

  public async deletePost(id: string): Promise<void> {
    try {
      await this.blogPostRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
  }

  public async updatePost(
    id: string,
    dto: UpdatePostDto
  ): Promise<BlogPostEntity> {
    const existingPost = await this.blogPostRepository.findById(id);
    if (!existingPost) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    if (dto.tags) {
      existingPost.tags = await this.blogTagService.getOrCreateTagsByTitles(
        dto.tags
      );
    }

    existingPost.status = dto.status ?? existingPost.status;
    existingPost.publishedAt = dto.publishedAt
      ? new Date(dto.publishedAt)
      : existingPost.publishedAt;
    existingPost.populateContent({
      title: dto.title ?? existingPost.title,
      videoUrl: dto.videoUrl ?? existingPost.videoUrl,
      announcement: dto.announcement ?? existingPost.announcement,
      text: dto.text ?? existingPost.text,
      quoteText: dto.quoteText ?? existingPost.quoteText,
      quoteAuthor: dto.quoteAuthor ?? existingPost.quoteAuthor,
      photo: dto.photo ?? existingPost.photo,
      linkUrl: dto.linkUrl ?? existingPost.linkUrl,
      linkDescription: dto.linkDescription ?? existingPost.linkDescription,
    });

    return this.blogPostRepository.update(id, existingPost);
  }
}
