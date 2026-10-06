import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'Unique tag title, stored in lower case',
    example: 'flowers',
  })
  public title!: string;
}
