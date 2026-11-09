import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokenRdo {
  @ApiProperty({
    description: 'Access token',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  @Expose()
  public accessToken!: string;

  @ApiProperty({
    description: 'Refresh token',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  @Expose()
  public refreshToken!: string;
}
