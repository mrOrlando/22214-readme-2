import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

// Values are passed to the blog service as they are: it checks the limits
// and returns the error if a value is not valid
export class PostsQuery {
  @ApiPropertyOptional({ description: 'Page number', type: Number, example: 1 })
  @IsOptional()
  @IsString()
  public page?: string;

  @ApiPropertyOptional({
    description: 'Posts per page, 25 at most',
    type: Number,
    example: 25,
  })
  @IsOptional()
  @IsString()
  public limit?: string;

  @ApiPropertyOptional({
    description:
      'Sorting, always descending: by publication date (default), likes or comments',
    enum: ['date', 'likes', 'comments'],
  })
  @IsOptional()
  @IsString()
  public sortBy?: string;

  @ApiPropertyOptional({
    description: 'Type of posts',
    enum: ['video', 'text', 'quote', 'photo', 'link'],
  })
  @IsOptional()
  @IsString()
  public type?: string;

  @ApiPropertyOptional({ description: 'Tag of posts', example: 'books' })
  @IsOptional()
  @IsString()
  public tag?: string;

  @ApiPropertyOptional({
    description: 'ID of the author of posts',
    example: '658170cbb954e9f5b905ccf4',
  })
  @IsOptional()
  @IsString()
  public userId?: string;
}
