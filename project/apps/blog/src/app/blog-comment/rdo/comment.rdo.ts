import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentRdo {
  @ApiProperty({
    description: 'Comment ID',
    example: '0c407441-e006-42bc-87aa-28a60e9799df',
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'Comment text',
    example: 'Great post, thank you for sharing!',
  })
  @Expose()
  public message!: string;

  @ApiProperty({
    description: 'Comment author ID',
    example: '6581762309c030b503e30512',
  })
  @Expose()
  public userId!: string;

  @ApiProperty({
    description: 'Post ID',
    example: '6d308040-96a2-4162-bea6-2338e9976540',
  })
  @Expose()
  public postId!: string;

  @ApiProperty({ description: 'Creation date' })
  @Expose()
  public createdAt!: Date;
}
