import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';
import { UserNameLength, UserPasswordLength } from '../auth.constants';

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
}
