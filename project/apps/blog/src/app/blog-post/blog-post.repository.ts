import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { BlogPostEntity } from './blog-post.entity';
import { Post } from '@project/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PostFilter, postFilterToPrismaFilter } from './blog-post.filter';

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
        tags: true,
        comments: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found.`);
    }

    return this.createEntityFromDocument(post);
  }

  public async find(filter?: PostFilter): Promise<BlogPostEntity[]> {
    const posts = await this.client.post.findMany({
      where: postFilterToPrismaFilter(filter),
      include: {
        tags: true,
        comments: true,
      },
    });

    return posts
      .map((post) => this.createEntityFromDocument(post))
      .filter((post): post is BlogPostEntity => post !== null);
  }

  override async save(entity: BlogPostEntity): Promise<BlogPostEntity> {
    const newPost = await this.client.post.create({
      data: {
        type: entity.type,
        ...entity.getContent(),
        userId: entity.userId,
        tags: {
          connect: entity.tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        tags: true,
        comments: true,
      },
    });

    return entity.populate(newPost);
  }

  override async update(
    id: string,
    entity: BlogPostEntity
  ): Promise<BlogPostEntity> {
    const updatedPost = await this.client.post.update({
      where: { id },
      data: {
        ...entity.getContent(),
        tags: {
          set: entity.tags.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        tags: true,
        comments: true,
      },
    });

    return entity.populate(updatedPost);
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.post.delete({
      where: { id },
    });
  }
}
