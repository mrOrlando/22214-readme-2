import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: 'User password',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  public password!: string;
}
