import { ApiProperty } from '@nestjs/swagger';
import { PostStatus } from '@project/types';
import { PostContentDto } from './post-content.dto';

export class UpdatePostDto extends PostContentDto {
  @ApiProperty({
    description: 'Post status',
    enum: Object.values(PostStatus),
    example: PostStatus.Draft,
    required: false,
  })
  public status?: PostStatus;

  @ApiProperty({
    description: 'Publication date (ISO 8601). Affects sorting of posts',
    example: '2026-10-06T12:00:00.000Z',
    required: false,
  })
  public publishedAt?: string;
}
