import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PostStatus, PostType } from '@project/types';
import { TagRdo } from '../../tags/tag.rdo';
import { AuthorRdo } from '../../users/author.rdo';

export class PostRdo {
  @ApiProperty({
    description: 'Post ID',
    example: '6d308040-96a2-4162-bea6-2338e9976540',
  })
  @Expose()
  public id!: string;

  @ApiProperty({ enum: Object.values(PostType) })
  @Expose()
  public type!: PostType;

  @ApiProperty({ enum: Object.values(PostStatus) })
  @Expose()
  public status!: PostStatus;

  @ApiProperty({
    description: 'Title ("video" and "text")',
    nullable: true,
    type: String,
  })
  @Expose()
  public title!: string | null;

  @ApiProperty({
    description: 'YouTube link ("video")',
    nullable: true,
    type: String,
  })
  @Expose()
  public videoUrl!: string | null;

  @ApiProperty({
    description: 'Announcement ("text")',
    nullable: true,
    type: String,
  })
  @Expose()
  public announcement!: string | null;

  @ApiProperty({ description: 'Text ("text")', nullable: true, type: String })
  @Expose()
  public text!: string | null;

  @ApiProperty({ description: 'Quote ("quote")', nullable: true, type: String })
  @Expose()
  public quoteText!: string | null;

  @ApiProperty({
    description: 'Quote author ("quote")',
    nullable: true,
    type: String,
  })
  @Expose()
  public quoteAuthor!: string | null;

  @ApiProperty({
    description: 'Path of the photo ("photo")',
    nullable: true,
    type: String,
  })
  @Expose()
  public photo!: string | null;

  @ApiProperty({ description: 'URL ("link")', nullable: true, type: String })
  @Expose()
  public linkUrl!: string | null;

  @ApiProperty({
    description: 'Description of the link ("link")',
    nullable: true,
    type: String,
  })
  @Expose()
  public linkDescription!: string | null;

  @ApiProperty({
    description: 'Author of the post',
    type: AuthorRdo,
    nullable: true,
  })
  @Expose()
  @Type(() => AuthorRdo)
  public author!: AuthorRdo | null;

  @ApiProperty({ description: 'Whether the post is a repost' })
  @Expose()
  public isRepost!: boolean;

  @ApiProperty({
    description: 'ID of the original post (reposts)',
    nullable: true,
    type: String,
  })
  @Expose()
  public originalPostId!: string | null;

  @ApiProperty({
    description: 'Author of the original post (reposts)',
    type: AuthorRdo,
    nullable: true,
  })
  @Expose()
  @Type(() => AuthorRdo)
  public originalAuthor!: AuthorRdo | null;

  @ApiProperty({ description: 'Creation date' })
  @Expose()
  public createdAt!: string;

  @ApiProperty({ description: 'Publication date' })
  @Expose()
  public publishedAt!: string;

  @ApiProperty({ description: 'Number of likes', example: 3 })
  @Expose()
  public likesCount!: number;

  @ApiProperty({ description: 'Number of comments', example: 5 })
  @Expose()
  public commentsCount!: number;

  @ApiProperty({ type: [TagRdo] })
  @Expose()
  @Type(() => TagRdo)
  public tags!: TagRdo[];
}
