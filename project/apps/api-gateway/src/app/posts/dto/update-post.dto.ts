import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PostStatus } from '@project/types';
import { OptionalTags, OptionalText } from './post-fields';

// The type of a post cannot be changed; fields of other types are ignored
export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'Status: move a post to drafts or publish it',
    enum: Object.values(PostStatus),
  })
  @IsOptional()
  @IsString()
  public status?: PostStatus;

  @OptionalText(
    'Publication date (ISO 8601). It affects the order of posts',
    '2026-10-06T12:00:00.000Z'
  )
  public publishedAt?: string;

  @OptionalText(
    'Title ("video" and "text" posts)',
    'A new title of the post for the readers'
  )
  public title?: string;

  @OptionalText(
    'Link to a YouTube video ("video" posts)',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  )
  public videoUrl?: string;

  @OptionalText(
    'Announcement ("text" posts)',
    'A new announcement of the post, at least fifty characters long'
  )
  public announcement?: string;

  @OptionalText('Text ("text" posts)', 'A new text of the post')
  public text?: string;

  @OptionalText(
    'Quote ("quote" posts)',
    'Simplicity is prerequisite for reliability.'
  )
  public quoteText?: string;

  @OptionalText('Author of the quote ("quote" posts)', 'Edsger Dijkstra')
  public quoteAuthor?: string;

  @OptionalText(
    'Path of a photo ("photo" posts)',
    '/api/files/5b8c93e4-92db-43c9-be4e-d6f94f08cda2.png'
  )
  public photo?: string;

  @OptionalText('URL ("link" posts)', 'https://docs.nestjs.com')
  public linkUrl?: string;

  @OptionalText(
    'Description of the link ("link" posts)',
    'NestJS documentation'
  )
  public linkDescription?: string;

  @OptionalTags()
  public tags?: string[];
}
