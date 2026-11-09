import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Text of the comment, 10 to 300 characters',
    example: 'Great post, thank you for sharing!',
    minLength: 10,
    maxLength: 300,
  })
  @IsString()
  @IsNotEmpty()
  public message!: string;
}
