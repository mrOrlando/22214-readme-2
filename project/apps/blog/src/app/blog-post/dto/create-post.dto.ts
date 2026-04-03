import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Thinner',
  })
  public title!: string;

  @ApiProperty({
    description: 'Post description',
    example: 'A horror novel by Stephen King',
  })
  public description!: string;

  @ApiProperty({
    description: 'Post content',
    example: 'I recently read the horror novel "Thinner".',
  })
  public content!: string;

  @ApiProperty({
    description: 'Post userId',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  public userId!: string;

  @ApiProperty({
    description: 'Post categories',
    example: ['horror'],
  })
  public categories!: string[];
}
