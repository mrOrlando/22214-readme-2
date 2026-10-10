import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class UserIdDto {
  @ApiProperty({
    description: 'ID of the user who performs the action',
    example: '6581762309c030b503e30512',
  })
  @IsMongoId()
  public userId!: string;
}
