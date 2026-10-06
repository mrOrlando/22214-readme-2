import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Thinner',
    required: false,
  })
  public title?: string;

  @ApiProperty({
    description: 'Post description',
    example: 'A horror novel by Stephen King',
    required: false,
  })
  public description?: string;

  @ApiProperty({
    description: 'Post content',
    example: 'I recently read the horror novel "Thinner".',
    required: false,
  })
  public content?: string;

  @ApiProperty({
    description: 'Post tags (titles)',
    example: ['horror', 'books'],
    required: false,
  })
  public tags?: string[];
}
