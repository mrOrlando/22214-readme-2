import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserRdo {
  @ApiProperty({
    description: 'User ID',
    example: '658170cbb954e9f5b905ccf4',
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @Expose()
  public name!: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @Expose()
  public email!: string;
}
