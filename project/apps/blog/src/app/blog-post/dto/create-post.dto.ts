import { ApiProperty } from '@nestjs/swagger';
import { PostStatus, PostType } from '@project/types';
import { PostContentDto } from './post-content.dto';

export class CreatePostDto extends PostContentDto {
  @ApiProperty({
    description: 'Post type',
    enum: Object.values(PostType),
    example: PostType.Text,
  })
  public type!: PostType;

  @ApiProperty({
    description: 'Post status. A new post is published by default',
    enum: Object.values(PostStatus),
    example: PostStatus.Published,
    required: false,
  })
  public status?: PostStatus;

  @ApiProperty({
    description: 'Post userId',
    example: '658170cbb954e9f5b905ccf4',
  })
  public userId!: string;
}
