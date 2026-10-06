import { PrismaClientService } from '@project/models';
import { BasePostgresRepository } from '@project/helpers';
import { BlogTagEntity } from './blog-tag.entity';
import { Tag } from '@project/types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TagFilter, tagFilterToPrismaFilter } from './blog-tag.filter';
import { MAX_TAGS_LIMIT } from './blog-tag.constants';

@Injectable()
export class BlogTagRepository extends BasePostgresRepository<
  BlogTagEntity,
  Tag
> {
  constructor(override readonly client: PrismaClientService) {
    super(client, BlogTagEntity.fromObject);
  }

  override async findById(id: string): Promise<BlogTagEntity | null> {
    const tag = await this.client.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with id ${id} not found.`);
    }

    return this.createEntityFromDocument(tag);
  }

  public async findByIds(ids: string[]): Promise<BlogTagEntity[]> {
    const tags = await this.client.tag.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return tags
      .map((tag) => this.createEntityFromDocument(tag))
      .filter((tag): tag is BlogTagEntity => tag !== null);
  }

  public async findByTitles(titles: string[]): Promise<BlogTagEntity[]> {
    const tags = await this.client.tag.findMany({
      where: {
        title: {
          in: titles,
        },
      },
    });

    return tags
      .map((tag) => this.createEntityFromDocument(tag))
      .filter((tag): tag is BlogTagEntity => tag !== null);
  }

  public async find(filter?: TagFilter): Promise<BlogTagEntity[]> {
    const tags = await this.client.tag.findMany({
      where: tagFilterToPrismaFilter(filter),
      take: MAX_TAGS_LIMIT,
    });

    return tags
      .map((tag) => this.createEntityFromDocument(tag))
      .filter((tag): tag is BlogTagEntity => tag !== null);
  }

  override async save(entity: BlogTagEntity): Promise<BlogTagEntity> {
    const newTag = await this.client.tag.create({
      data: entity.toPOJO(),
    });

    entity.id = newTag.id;
    return entity;
  }

  override async update(
    id: string,
    entity: BlogTagEntity
  ): Promise<BlogTagEntity> {
    const updatedTag = await this.client.tag.update({
      where: { id },
      data: {
        title: entity.title,
      },
    });

    const updatedEntity = this.createEntityFromDocument(updatedTag);
    if (!updatedEntity) {
      throw new NotFoundException(`Tag with id ${id} not found.`);
    }

    return updatedEntity;
  }

  override async deleteById(id: string): Promise<void> {
    await this.client.tag.delete({
      where: { id },
    });
  }
}
