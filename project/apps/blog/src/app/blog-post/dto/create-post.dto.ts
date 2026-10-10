import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PostStatus, PostType } from '@project/types';
import {
  POST_LINK_DESCRIPTION_MAX_LENGTH,
  PostAnnouncementLength,
  PostQuoteAuthorLength,
  PostQuoteTextLength,
  PostTextLength,
  PostTitleLength,
  YOUTUBE_URL_PATTERN,
  YOUTUBE_URL_PATTERN_ERROR,
} from '../blog-post.constants';
import { PostTags } from './post-tags.decorator';

const isType =
  (...types: PostType[]) =>
  (dto: CreatePostDto) =>
    types.includes(dto.type);

export class CreatePostDto {
  @ApiProperty({
    description: 'Post type. Defines which fields are required',
    enum: Object.values(PostType),
    example: PostType.Text,
  })
  @IsIn(Object.values(PostType))
  public type!: PostType;

  @ApiProperty({
    description: 'Post author ID',
    example: '658170cbb954e9f5b905ccf4',
  })
  @IsMongoId()
  public userId!: string;

  @ApiProperty({
    description: 'Post status. A new post is published by default',
    enum: Object.values(PostStatus),
    example: PostStatus.Published,
    required: false,
  })
  @IsOptional()
  @IsIn(Object.values(PostStatus))
  public status?: PostStatus;

  @ApiProperty({
    description: 'Post title. Required for "video" and "text" posts',
    example: 'Thinner: a horror novel worth reading',
    required: false,
    minLength: PostTitleLength.Min,
    maxLength: PostTitleLength.Max,
  })
  @ValidateIf(isType(PostType.Video, PostType.Text))
  @IsString()
  @Length(PostTitleLength.Min, PostTitleLength.Max)
  public title?: string;

  @ApiProperty({
    description: 'Link to a YouTube video. Required for "video" posts',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    required: false,
  })
  @ValidateIf(isType(PostType.Video))
  @Matches(YOUTUBE_URL_PATTERN, { message: YOUTUBE_URL_PATTERN_ERROR })
  public videoUrl?: string;

  @ApiProperty({
    description: 'Post announcement. Required for "text" posts',
    example:
      "In my opinion, it is one of Stephen King's scariest and most underrated novels.",
    required: false,
    minLength: PostAnnouncementLength.Min,
    maxLength: PostAnnouncementLength.Max,
  })
  @ValidateIf(isType(PostType.Text))
  @IsString()
  @Length(PostAnnouncementLength.Min, PostAnnouncementLength.Max)
  public announcement?: string;

  @ApiProperty({
    description: 'Post text. Required for "text" posts',
    example:
      'I recently read the horror novel "Thinner". The story of a lawyer cursed to lose weight keeps you tense until the last page.',
    required: false,
    minLength: PostTextLength.Min,
    maxLength: PostTextLength.Max,
  })
  @ValidateIf(isType(PostType.Text))
  @IsString()
  @Length(PostTextLength.Min, PostTextLength.Max)
  public text?: string;

  @ApiProperty({
    description: 'Quote text. Required for "quote" posts',
    example: 'Simplicity is prerequisite for reliability.',
    required: false,
    minLength: PostQuoteTextLength.Min,
    maxLength: PostQuoteTextLength.Max,
  })
  @ValidateIf(isType(PostType.Quote))
  @IsString()
  @Length(PostQuoteTextLength.Min, PostQuoteTextLength.Max)
  public quoteText?: string;

  @ApiProperty({
    description: 'Quote author. Required for "quote" posts',
    example: 'Edsger Dijkstra',
    required: false,
    minLength: PostQuoteAuthorLength.Min,
    maxLength: PostQuoteAuthorLength.Max,
  })
  @ValidateIf(isType(PostType.Quote))
  @IsString()
  @Length(PostQuoteAuthorLength.Min, PostQuoteAuthorLength.Max)
  public quoteAuthor?: string;

  @ApiProperty({
    description: 'Path to the uploaded photo. Required for "photo" posts',
    example: '/uploads/2026/10/photo.jpg',
    required: false,
  })
  @ValidateIf(isType(PostType.Photo))
  @IsString()
  @IsNotEmpty()
  public photo?: string;

  @ApiProperty({
    description: 'URL. Required for "link" posts',
    example: 'https://nestjs.com',
    required: false,
  })
  @ValidateIf(isType(PostType.Link))
  @IsUrl()
  public linkUrl?: string;

  @ApiProperty({
    description: 'Link description. Optional, used by "link" posts',
    example: 'A progressive Node.js framework',
    required: false,
    maxLength: POST_LINK_DESCRIPTION_MAX_LENGTH,
  })
  @ValidateIf(isType(PostType.Link))
  @IsOptional()
  @IsString()
  @MaxLength(POST_LINK_DESCRIPTION_MAX_LENGTH)
  public linkDescription?: string;

  @PostTags()
  public tags?: string[];
}
