import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsISO8601,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import { PostStatus } from '@project/types';
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

// The post type cannot be changed; fields of other post types are ignored
export class UpdatePostDto {
  @ApiProperty({
    description: 'ID of the user who edits the post. Must be the post author',
    example: '658170cbb954e9f5b905ccf4',
  })
  @IsMongoId()
  public userId!: string;

  @ApiProperty({
    description: 'Post status',
    enum: Object.values(PostStatus),
    example: PostStatus.Draft,
    required: false,
  })
  @IsOptional()
  @IsIn(Object.values(PostStatus))
  public status?: PostStatus;

  @ApiProperty({
    description: 'Publication date (ISO 8601). Affects sorting of posts',
    example: '2026-10-06T12:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsISO8601()
  public publishedAt?: string;

  @ApiProperty({
    description: 'Post title ("video" and "text" posts)',
    required: false,
    minLength: PostTitleLength.Min,
    maxLength: PostTitleLength.Max,
  })
  @IsOptional()
  @IsString()
  @Length(PostTitleLength.Min, PostTitleLength.Max)
  public title?: string;

  @ApiProperty({
    description: 'Link to a YouTube video ("video" posts)',
    required: false,
  })
  @IsOptional()
  @Matches(YOUTUBE_URL_PATTERN, { message: YOUTUBE_URL_PATTERN_ERROR })
  public videoUrl?: string;

  @ApiProperty({
    description: 'Post announcement ("text" posts)',
    required: false,
    minLength: PostAnnouncementLength.Min,
    maxLength: PostAnnouncementLength.Max,
  })
  @IsOptional()
  @IsString()
  @Length(PostAnnouncementLength.Min, PostAnnouncementLength.Max)
  public announcement?: string;

  @ApiProperty({
    description: 'Post text ("text" posts)',
    required: false,
    minLength: PostTextLength.Min,
    maxLength: PostTextLength.Max,
  })
  @IsOptional()
  @IsString()
  @Length(PostTextLength.Min, PostTextLength.Max)
  public text?: string;

  @ApiProperty({
    description: 'Quote text ("quote" posts)',
    required: false,
    minLength: PostQuoteTextLength.Min,
    maxLength: PostQuoteTextLength.Max,
  })
  @IsOptional()
  @IsString()
  @Length(PostQuoteTextLength.Min, PostQuoteTextLength.Max)
  public quoteText?: string;

  @ApiProperty({
    description: 'Quote author ("quote" posts)',
    required: false,
    minLength: PostQuoteAuthorLength.Min,
    maxLength: PostQuoteAuthorLength.Max,
  })
  @IsOptional()
  @IsString()
  @Length(PostQuoteAuthorLength.Min, PostQuoteAuthorLength.Max)
  public quoteAuthor?: string;

  @ApiProperty({
    description: 'Path to the uploaded photo ("photo" posts)',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public photo?: string;

  @ApiProperty({
    description: 'URL ("link" posts)',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  public linkUrl?: string;

  @ApiProperty({
    description: 'Link description ("link" posts)',
    required: false,
    maxLength: POST_LINK_DESCRIPTION_MAX_LENGTH,
  })
  @IsOptional()
  @IsString()
  @MaxLength(POST_LINK_DESCRIPTION_MAX_LENGTH)
  public linkDescription?: string;

  @PostTags()
  public tags?: string[];
}
