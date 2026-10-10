import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PostStatus, PostType } from '@project/types';
import { TagRdo } from '../../blog-tag/rdo';

export class PostRdo {
  @ApiProperty({
    description: 'Post ID',
    example: '6d308040-96a2-4162-bea6-2338e9976540',
  })
  @Expose()
  public id!: string;

  @ApiProperty({ description: 'Post type', enum: Object.values(PostType) })
  @Expose()
  public type!: PostType;

  @ApiProperty({ description: 'Post status', enum: Object.values(PostStatus) })
  @Expose()
  public status!: PostStatus;

  @ApiProperty({ description: 'Post title', nullable: true, type: String })
  @Expose()
  public title!: string | null;

  @ApiProperty({ description: 'YouTube link', nullable: true, type: String })
  @Expose()
  public videoUrl!: string | null;

  @ApiProperty({ description: 'Announcement', nullable: true, type: String })
  @Expose()
  public announcement!: string | null;

  @ApiProperty({ description: 'Post text', nullable: true, type: String })
  @Expose()
  public text!: string | null;

  @ApiProperty({ description: 'Quote text', nullable: true, type: String })
  @Expose()
  public quoteText!: string | null;

  @ApiProperty({ description: 'Quote author', nullable: true, type: String })
  @Expose()
  public quoteAuthor!: string | null;

  @ApiProperty({ description: 'Photo path', nullable: true, type: String })
  @Expose()
  public photo!: string | null;

  @ApiProperty({ description: 'Link URL', nullable: true, type: String })
  @Expose()
  public linkUrl!: string | null;

  @ApiProperty({
    description: 'Link description',
    nullable: true,
    type: String,
  })
  @Expose()
  public linkDescription!: string | null;

  @ApiProperty({
    description: 'Post author ID',
    example: '658170cbb954e9f5b905ccf4',
  })
  @Expose()
  public userId!: string;

  @ApiProperty({ description: 'Whether the post is a repost' })
  @Expose()
  public isRepost!: boolean;

  @ApiProperty({
    description: 'Original post ID (for reposts)',
    nullable: true,
    type: String,
  })
  @Expose()
  public originalPostId!: string | null;

  @ApiProperty({
    description: 'Original author ID (for reposts)',
    nullable: true,
    type: String,
  })
  @Expose()
  public originalUserId!: string | null;

  @ApiProperty({ description: 'Creation date' })
  @Expose()
  public createdAt!: Date;

  @ApiProperty({ description: 'Publication date' })
  @Expose()
  public publishedAt!: Date;

  @ApiProperty({ description: 'Number of likes', example: 3 })
  @Expose()
  public likesCount!: number;

  @ApiProperty({ description: 'Number of comments', example: 5 })
  @Expose()
  public commentsCount!: number;

  @ApiProperty({ description: 'Post tags', type: [TagRdo] })
  @Expose()
  @Type(() => TagRdo)
  public tags!: TagRdo[];
}
