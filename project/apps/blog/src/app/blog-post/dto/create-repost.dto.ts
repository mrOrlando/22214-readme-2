import { ApiProperty } from '@nestjs/swagger';

export class CreateRepostDto {
  @ApiProperty({
    description: 'User id who reposts the post',
    example: '6581762309c030b503e30512',
  })
  public userId!: string;
}
