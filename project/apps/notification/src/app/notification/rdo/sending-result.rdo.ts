import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SendingResultRdo {
  @ApiProperty({
    description: 'Number of new publications included in the mailing',
    example: 3,
  })
  @Expose()
  public publications!: number;

  @ApiProperty({ description: 'Number of subscribers', example: 10 })
  @Expose()
  public recipients!: number;

  @ApiProperty({ description: 'Number of letters sent', example: 10 })
  @Expose()
  public sent!: number;

  @ApiProperty({ description: 'Number of letters not sent', example: 0 })
  @Expose()
  public failed!: number;
}
