import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PostStatus, PostType } from '@project/types';
import { OptionalTags, OptionalText } from './post-fields';

export class CreatePostDto {
  @ApiProperty({
    description: 'Type of the post. It defines which fields are required',
    enum: Object.values(PostType),
    example: PostType.Text,
  })
  @IsString()
  public type!: PostType;

  @ApiPropertyOptional({
    description: 'Status of the post. A new post is published by default',
    enum: Object.values(PostStatus),
  })
  @IsOptional()
  @IsString()
  public status?: PostStatus;

  @OptionalText(
    'Title, 20 to 50 characters. Required for "video" and "text" posts',
    'Thinner: a horror novel worth reading'
  )
  public title?: string;

  @OptionalText(
    'Link to a YouTube video. Required for "video" posts',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  )
  public videoUrl?: string;

  @OptionalText(
    'Announcement, 50 to 255 characters. Required for "text" posts',
    "In my opinion, it is one of Stephen King's scariest and most underrated novels."
  )
  public announcement?: string;

  @OptionalText(
    'Text, 100 to 1024 characters. Required for "text" posts',
    'I recently read the horror novel "Thinner". The story of a lawyer cursed to lose weight keeps you tense until the last page.'
  )
  public text?: string;

  @OptionalText(
    'Quote, 20 to 300 characters. Required for "quote" posts',
    'Simplicity is prerequisite for reliability.'
  )
  public quoteText?: string;

  @OptionalText(
    'Author of the quote, 3 to 50 characters. Required for "quote" posts',
    'Edsger Dijkstra'
  )
  public quoteAuthor?: string;

  @OptionalText(
    'Path of an uploaded photo. Required for "photo" posts',
    '/api/files/5b8c93e4-92db-43c9-be4e-d6f94f08cda2.png'
  )
  public photo?: string;

  @OptionalText('URL. Required for "link" posts', 'https://docs.nestjs.com')
  public linkUrl?: string;

  @OptionalText(
    'Description of the link, up to 300 characters. Optional for "link" posts',
    'NestJS documentation'
  )
  public linkDescription?: string;

  @OptionalTags()
  public tags?: string[];
}
