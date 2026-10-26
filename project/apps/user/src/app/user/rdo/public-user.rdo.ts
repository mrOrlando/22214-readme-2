import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

// Data of a user that can be shown to everybody
export class PublicUserRdo {
  @ApiProperty({
    description: 'User ID',
    example: '658170cbb954e9f5b905ccf4',
  })
  @Expose()
  public id!: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  @Expose()
  public name!: string;

  @ApiProperty({
    description: 'Path of the avatar on the file server',
    example: '/api/files/5b8c93e4-92db-43c9-be4e-d6f94f08cda2.png',
    nullable: true,
    type: String,
  })
  @Expose()
  public avatar!: string | null;
}
