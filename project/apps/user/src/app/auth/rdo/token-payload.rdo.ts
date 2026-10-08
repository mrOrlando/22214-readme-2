import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadRdo {
  @ApiProperty({
    description: 'User ID',
    example: '658170cbb954e9f5b905ccf4',
  })
  @Expose()
  public sub!: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @Expose()
  public email!: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @Expose()
  public name!: string;
}
