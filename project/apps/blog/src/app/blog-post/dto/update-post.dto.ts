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
    description: 'Post categories',
    example: ['39614113-7ad5-45b6-8093-06455437e1e2'],
    required: false,
  })
  public categories?: string[];
}
