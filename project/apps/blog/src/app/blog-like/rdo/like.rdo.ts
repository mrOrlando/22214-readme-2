import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LikeRdo {
  @ApiProperty({
    description: 'Like ID',
    example: '5b8c93e4-92db-43c9-be4e-d6f94f08cda2',
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'ID of the user who liked the post',
    example: '6581762309c030b503e30512',
  })
  @Expose()
  public userId!: string;

  @ApiProperty({
    description: 'Liked post ID',
    example: '6d308040-96a2-4162-bea6-2338e9976540',
  })
  @Expose()
  public postId!: string;

  @ApiProperty({ description: 'Creation date' })
  @Expose()
  public createdAt!: Date;
}
