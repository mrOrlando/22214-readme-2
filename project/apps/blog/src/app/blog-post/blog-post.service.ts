import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostEntity } from './blog-post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogTagService } from '../blog-tag/blog-tag.service';
import { UpdatePostDto } from './dto/update-post.dto';

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
