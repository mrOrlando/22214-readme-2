import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { UserPasswordLength } from '../auth.constants';

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password', example: '123456' })
  @IsString()
  @IsNotEmpty()
  public currentPassword!: string;

  @ApiProperty({
    description: 'New password',
    example: '654321',
    minLength: UserPasswordLength.Min,
    maxLength: UserPasswordLength.Max,
  })
  @IsString()
  @IsNotEmpty()
  public newPassword!: string;
}
