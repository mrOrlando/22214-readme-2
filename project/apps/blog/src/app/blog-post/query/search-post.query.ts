import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchPostQuery {
  @ApiProperty({
    description:
      'Words to look for in post titles. A match of any single word is enough',
    example: 'javascript book',
  })
  @IsString()
  @IsNotEmpty()
  public title!: string;
}
