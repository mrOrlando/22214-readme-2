import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthorRdo {
  @ApiProperty({ description: 'User ID', example: '658170cbb954e9f5b905ccf4' })
  @Expose()
  public id!: string;

  @ApiProperty({ description: 'First and last name', example: 'John Doe' })
  @Expose()
  public name!: string;

  @ApiProperty({
    description: 'Path of the avatar',
    example: '/api/files/5b8c93e4-92db-43c9-be4e-d6f94f08cda2.png',
    nullable: true,
    type: String,
  })
  @Expose()
  public avatar!: string | null;
}
