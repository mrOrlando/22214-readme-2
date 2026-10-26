import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LikeRdo {
  @ApiProperty({ description: 'Like ID' })
  @Expose()
  public id!: string;

  @ApiProperty({ description: 'ID of the user who liked the post' })
  @Expose()
  public userId!: string;

  @ApiProperty({ description: 'ID of the liked post' })
  @Expose()
  public postId!: string;

  @ApiProperty({ description: 'Creation date' })
  @Expose()
  public createdAt!: string;
}
