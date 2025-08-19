import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoggedUserRdo {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @Expose()
  public email!: string;

  @ApiProperty({
    description: 'User access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAbm90Zm91bmQubG9jYWwiLCJyb2xlIjoidXNlciIsImxhc3RuYW1lIjoiU21pdGgiLCJmaXJzdG5hbWUiOiJLZWtzIiwiaWF0IjoxNzA0NjE5MTk5LCJleHAiOjE3MDQ2MTk0OTl9.skXytHVZvtETNqSSqUjsVIq4ogGs3fD_7mgn1qpRLPo',
  })
  @Expose()
  public accessToken!: string;
}
