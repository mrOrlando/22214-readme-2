import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString, Length } from 'class-validator';
import { CommentMessageLength } from '../blog-comment.constants';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'Great post, thank you for sharing!',
    minLength: CommentMessageLength.Min,
    maxLength: CommentMessageLength.Max,
  })
  @IsString()
  @Length(CommentMessageLength.Min, CommentMessageLength.Max)
  public message!: string;

  @ApiProperty({
    description: 'Comment author ID',
    example: '6581762309c030b503e30512',
  })
  @IsMongoId()
  public userId!: string;
}
