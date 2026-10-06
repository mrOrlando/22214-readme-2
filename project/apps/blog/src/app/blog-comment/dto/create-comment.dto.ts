import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'Great post!',
  })
  public message!: string;

  @ApiProperty({
    description: 'Author user id',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  public userId!: string;

  @ApiProperty({
    description: 'Post id the comment belongs to',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  public postId!: string;
}
