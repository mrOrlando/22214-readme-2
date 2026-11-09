import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AuthorRdo } from '../../users/author.rdo';

export class CommentRdo {
  @ApiProperty({
    description: 'Comment ID',
    example: '0c407441-e006-42bc-87aa-28a60e9799df',
  })
  @Expose()
  public id!: string;

  @ApiProperty({ description: 'Text', example: 'Great post, thank you!' })
  @Expose()
  public message!: string;

  @ApiProperty({ description: 'Post ID' })
  @Expose()
  public postId!: string;

  @ApiProperty({
    description: 'Author of the comment',
    type: AuthorRdo,
    nullable: true,
  })
  @Expose()
  @Type(() => AuthorRdo)
  public author!: AuthorRdo | null;

  @ApiProperty({ description: 'Creation date' })
  @Expose()
  public createdAt!: string;
}
