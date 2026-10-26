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

  @ApiProperty({
    description: 'Path of the avatar on the file server',
    example: '/api/files/5b8c93e4-92db-43c9-be4e-d6f94f08cda2.png',
    nullable: true,
    type: String,
  })
  @Expose()
  public avatar!: string | null;
}
