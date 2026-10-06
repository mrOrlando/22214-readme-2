import { ApiProperty } from '@nestjs/swagger';

export class CreateLikeDto {
  @ApiProperty({
    description: 'User id who likes the post',
    example: '658170cbb954e9f5b905ccf4',
  })
  public userId!: string;

  @ApiProperty({
    description: 'Liked post id',
    example: '6d308040-96a2-4162-bea6-2338e9976540',
  })
  public postId!: string;
}
