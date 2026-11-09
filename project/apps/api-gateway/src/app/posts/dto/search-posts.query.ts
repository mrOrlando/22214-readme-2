import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchPostsQuery {
  @ApiProperty({
    description: 'Words of the title. A match of any single word is enough',
    example: 'javascript book',
  })
  @IsString()
  @IsNotEmpty()
  public title!: string;
}
