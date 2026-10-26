import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayMaxSize, ArrayNotEmpty, IsMongoId } from 'class-validator';
import { MAX_USERS_BY_IDS } from '../user.constants';

export class UsersByIdsQuery {
  @ApiProperty({
    description: 'Comma separated IDs of users',
    example: '658170cbb954e9f5b905ccf4,6581762309c030b503e30512',
    type: String,
  })
  @Transform(({ value }) =>
    typeof value === 'string'
      ? [...new Set(value.split(',').map((id) => id.trim()))]
      : value
  )
  @ArrayNotEmpty()
  @ArrayMaxSize(MAX_USERS_BY_IDS)
  @IsMongoId({ each: true })
  public ids!: string[];
}
