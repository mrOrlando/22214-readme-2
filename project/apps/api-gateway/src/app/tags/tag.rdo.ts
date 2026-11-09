import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TagRdo {
  @ApiProperty({
    description: 'Tag ID',
    example: '39614113-7ad5-45b6-8093-06455437e1e2',
  })
  @Expose()
  public id!: string;

  @ApiProperty({ description: 'Tag title', example: 'books' })
  @Expose()
  public title!: string;
}
