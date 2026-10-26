import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import {
  USER_AVATAR_MAX_LENGTH,
  UserNameLength,
  UserPasswordLength,
} from '../auth.constants';

export class CreateUserDto {
  @ApiProperty({
    description: 'User unique email, used as a login',
    example: 'user@example.com',
  })
  @IsEmail()
  public email!: string;

  @ApiProperty({
    description: 'User first and last name',
    example: 'John Doe',
    minLength: UserNameLength.Min,
    maxLength: UserNameLength.Max,
  })
  @IsString()
  @Length(UserNameLength.Min, UserNameLength.Max)
  public name!: string;

  @ApiProperty({
    description: 'User password',
    example: '12345678',
    minLength: UserPasswordLength.Min,
    maxLength: UserPasswordLength.Max,
  })
  @IsString()
  @Length(UserPasswordLength.Min, UserPasswordLength.Max)
  public password!: string;

  @ApiProperty({
    description: 'Path of the avatar uploaded to the file server',
    example: '/api/files/5b8c93e4-92db-43c9-be4e-d6f94f08cda2.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(USER_AVATAR_MAX_LENGTH)
  public avatar?: string;
}
