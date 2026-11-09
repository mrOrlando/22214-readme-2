import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'E-mail of the user',
    example: 'user@example.com',
    format: 'email',
  })
  // The format is checked by the user service, which returns all errors at once
  @IsString()
  @IsNotEmpty()
  public email!: string;

  @ApiProperty({ description: 'Password', example: '123456' })
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
