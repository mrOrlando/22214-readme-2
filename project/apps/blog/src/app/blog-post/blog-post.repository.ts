import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { BlogPostEntity } from './blog-post.entity';
import { Post } from '@project/types';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<
  BlogPostEntity,
  Post
> {
  constructor(override readonly client: PrismaClientService) {
    super(client, BlogPostEntity.fromObject);
  }

  override async findById(id: string): Promise<BlogPostEntity | null> {
    const post = await this.client.post.findUnique({
      where: { id },
      include: {
        categories: true,
        comments: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return this.createEntityFromDocument(post);
  }

  public async find(): Promise<BlogPostEntity[]> {
    const posts = await this.client.post.findMany({
      include: {
        categories: true,
        comments: true,
      },
    });

    return posts
      .map((post) => this.createEntityFromDocument(post))
      .filter((post): post is BlogPostEntity => post !== null);
  }
}
