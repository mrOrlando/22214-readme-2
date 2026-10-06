import { ApiProperty } from '@nestjs/swagger';

export class UpdateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'Updated comment',
  })
  public message!: string;
}
