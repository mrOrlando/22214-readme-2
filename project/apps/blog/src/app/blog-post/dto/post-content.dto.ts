import { ApiProperty } from '@nestjs/swagger';

export class PostContentDto {
  @ApiProperty({
    description: 'Post title. Used by "video" and "text" posts',
    example: 'Thinner: a horror novel worth reading',
    required: false,
  })
  public title?: string;

  @ApiProperty({
    description: 'Link to a YouTube video. Used by "video" posts',
    example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    required: false,
  })
  public videoUrl?: string;

  @ApiProperty({
    description: 'Post announcement. Used by "text" posts',
    example: "In my opinion, it is one of Stephen King's scariest novels.",
    required: false,
  })
  public announcement?: string;

  @ApiProperty({
    description: 'Post text. Used by "text" posts',
    example: 'I recently read the horror novel "Thinner".',
    required: false,
  })
  public text?: string;

  @ApiProperty({
    description: 'Quote text. Used by "quote" posts',
    example: 'Stay hungry. Stay foolish.',
    required: false,
  })
  public quoteText?: string;

  @ApiProperty({
    description: 'Quote author. Used by "quote" posts',
    example: 'Steve Jobs',
    required: false,
  })
  public quoteAuthor?: string;

  @ApiProperty({
    description: 'Path to the uploaded photo. Used by "photo" posts',
    example: '/uploads/2026/10/photo.jpg',
    required: false,
  })
  public photo?: string;

  @ApiProperty({
    description: 'URL. Used by "link" posts',
    example: 'https://nestjs.com',
    required: false,
  })
  public linkUrl?: string;

  @ApiProperty({
    description: 'Link description. Used by "link" posts',
    example: 'A progressive Node.js framework',
    required: false,
  })
  public linkDescription?: string;

  @ApiProperty({
    description: 'Post tags (titles)',
    example: ['horror', 'books'],
    required: false,
  })
  public tags?: string[];
}
