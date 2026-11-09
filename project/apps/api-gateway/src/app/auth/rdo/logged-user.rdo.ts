import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserRdo } from './user.rdo';

export class LoggedUserRdo extends UserRdo {
  @ApiProperty({
    description: 'Access token: send it as "Authorization: Bearer <token>"',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  public accessToken!: string;

  @ApiProperty({
    description: 'Refresh token: it is used once to get a new pair of tokens',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @Expose()
  public refreshToken!: string;
}
