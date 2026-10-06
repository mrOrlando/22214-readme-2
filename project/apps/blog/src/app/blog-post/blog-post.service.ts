import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostEntity } from './blog-post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { BlogCategoryService } from '../blog-category/blog-category.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class BlogPostService {
  constructor(
    private readonly blogPostRepository: BlogPostRepository,
    private readonly blogCategoryService: BlogCategoryService
  ) {}

  public async getPost(id: string): Promise<BlogPostEntity | null> {
    return this.blogPostRepository.findById(id);
  }

  public async getAllPosts(): Promise<BlogPostEntity[]> {
    return this.blogPostRepository.find();
  }

  public async createPost(dto: CreatePostDto): Promise<BlogPostEntity> {
    const categories = await this.blogCategoryService.getCategoriesByIds(
      dto.categories
    );
    const newPost = BlogPostEntity.fromDto(dto, categories);
    await this.blogPostRepository.save(newPost);

    return newPost;
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

    if (dto.categories) {
      existingPost.categories =
        await this.blogCategoryService.getCategoriesByIds(dto.categories);
    }

    existingPost.title = dto.title ?? existingPost.title;
    existingPost.description = dto.description ?? existingPost.description;
    existingPost.content = dto.content ?? existingPost.content;

    return this.blogPostRepository.update(id, existingPost);
  }
}
