import { ConflictException, Injectable } from '@nestjs/common';
import { BlogTagRepository } from './blog-tag.repository';
import { BlogTagEntity } from './blog-tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { normalizeTagTitle, TAG_EXISTS_ERROR } from './blog-tag.constants';

@Injectable()
export class BlogTagService {
  constructor(private readonly blogTagRepository: BlogTagRepository) {}

  public async getTag(id: string): Promise<BlogTagEntity | null> {
    return this.blogTagRepository.findById(id);
  }

  public async getAllTags(): Promise<BlogTagEntity[]> {
    return this.blogTagRepository.find();
  }

  public async getTagsByIds(tagIds: string[]): Promise<BlogTagEntity[]> {
    return this.blogTagRepository.findByIds(tagIds);
  }

  public async getOrCreateTagsByTitles(
    titles: string[] = []
  ): Promise<BlogTagEntity[]> {
    const uniqueTitles = [...new Set(titles.map(normalizeTagTitle))].filter(
      (title) => title.length > 0
    );
    const existingTags = await this.blogTagRepository.findByTitles(
      uniqueTitles
    );
    const existingTitles = new Set(existingTags.map((tag) => tag.title));
    const newTags = await Promise.all(
      uniqueTitles
        .filter((title) => !existingTitles.has(title))
        .map((title) =>
          this.blogTagRepository.save(new BlogTagEntity({ title }))
        )
    );

    return [...existingTags, ...newTags];
  }

  public async createTag(dto: CreateTagDto): Promise<BlogTagEntity> {
    await this.checkTitleIsFree(dto.title);

    const newTag = new BlogTagEntity({ title: dto.title });
    await this.blogTagRepository.save(newTag);

    return newTag;
  }

  public async deleteTag(id: string): Promise<void> {
    await this.blogTagRepository.findById(id);
    await this.blogTagRepository.deleteById(id);
  }

  public async updateTag(
    id: string,
    dto: UpdateTagDto
  ): Promise<BlogTagEntity> {
    await this.blogTagRepository.findById(id);
    await this.checkTitleIsFree(dto.title, id);

    return this.blogTagRepository.update(
      id,
      new BlogTagEntity({ title: dto.title })
    );
  }

  private async checkTitleIsFree(title: string, ownId?: string): Promise<void> {
    const existingTag = (await this.blogTagRepository.find({ title })).at(0);

    if (existingTag && existingTag.id !== ownId) {
      throw new ConflictException(TAG_EXISTS_ERROR);
    }
  }
}
