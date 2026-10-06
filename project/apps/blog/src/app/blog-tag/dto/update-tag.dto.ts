import { ApiProperty } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiProperty({
    description: 'Unique tag title, stored in lower case',
    example: 'flowers',
  })
  public title!: string;
}
