import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SubscriptionsRdo {
  @ApiProperty({
    description: 'IDs of the authors the user is subscribed to, newest first',
    example: ['6581762309c030b503e30512'],
    type: [String],
  })
  @Expose()
  public authorIds!: string[];
}
