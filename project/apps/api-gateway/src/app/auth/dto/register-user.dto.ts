import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserNameLength, UserPasswordLength } from '../auth.constants';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Unique e-mail of the user, it is used as a login',
    example: 'user@example.com',
    format: 'email',
  })
  // The format is checked by the user service, which returns all errors at once
  @IsString()
  @IsNotEmpty()
  public email!: string;

  @ApiProperty({
    description: 'First and last name',
    example: 'John Doe',
    minLength: UserNameLength.Min,
    maxLength: UserNameLength.Max,
  })
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @ApiProperty({
    description: 'Password',
    example: '123456',
    minLength: UserPasswordLength.Min,
    maxLength: UserPasswordLength.Max,
  })
  @IsString()
  @IsNotEmpty()
  public password!: string;

  // The file is read by the controller; the property only documents the field
  @ApiPropertyOptional({
    description:
      'Avatar: a jpg or png image up to 500 KB (multipart/form-data)',
    type: 'string',
    format: 'binary',
  })
  public avatar?: unknown;
}
