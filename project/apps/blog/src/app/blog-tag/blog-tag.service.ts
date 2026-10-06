import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogTagRepository } from './blog-tag.repository';
import { BlogTagEntity } from './blog-tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

function normalizeTagTitle(title: string): string {
  return title.trim().toLowerCase();
}

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
    const title = normalizeTagTitle(dto.title);
    const existingTag = (
      await this.blogTagRepository.find({
        title,
      })
    ).at(0);

    if (existingTag) {
      throw new ConflictException('Tag with this title already exists');
    }

    const newTag = new BlogTagEntity({ title });
    await this.blogTagRepository.save(newTag);

    return newTag;
  }

  public async deleteTag(id: string): Promise<void> {
    try {
      await this.blogTagRepository.deleteById(id);
    } catch {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
  }

  public async updateTag(
    id: string,
    dto: UpdateTagDto
  ): Promise<BlogTagEntity> {
    const entity = new BlogTagEntity({
      title: normalizeTagTitle(dto.title),
    });

    try {
      const updatedTag = await this.blogTagRepository.update(id, entity);
      return updatedTag;
    } catch {
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
  }
}
