import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Unique category name',
    example: 'flowers',
  })
  public title!: string;
}
