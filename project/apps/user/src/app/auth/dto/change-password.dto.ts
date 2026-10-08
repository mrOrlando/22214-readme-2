import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { UserPasswordLength } from '../auth.constants';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Current user password',
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  public currentPassword!: string;

  @ApiProperty({
    description: 'New user password',
    example: '87654321',
    minLength: UserPasswordLength.Min,
    maxLength: UserPasswordLength.Max,
  })
  @IsString()
  @Length(UserPasswordLength.Min, UserPasswordLength.Max)
  public newPassword!: string;
}
