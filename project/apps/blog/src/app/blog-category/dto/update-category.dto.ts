import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Unique category name',
    example: 'flowers',
  })
  public title!: string;
}
