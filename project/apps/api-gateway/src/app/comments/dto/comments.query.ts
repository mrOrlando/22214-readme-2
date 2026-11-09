import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CommentsQuery {
  @ApiPropertyOptional({ description: 'Page number', type: Number, example: 1 })
  @IsOptional()
  @IsString()
  public page?: string;

  @ApiPropertyOptional({
    description: 'Comments per page, 50 at most',
    type: Number,
    example: 50,
  })
  @IsOptional()
  @IsString()
  public limit?: string;
}
