import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class UserIdQuery {
  @ApiProperty({
    description: 'ID of the user who performs the action',
    example: '658170cbb954e9f5b905ccf4',
  })
  @IsMongoId()
  public userId!: string;
}
