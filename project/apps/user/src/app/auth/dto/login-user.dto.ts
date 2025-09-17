import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  public email!: string;

  @ApiProperty({
    description: 'User password',
    example: '12345678',
  })
  public password!: string;
}
