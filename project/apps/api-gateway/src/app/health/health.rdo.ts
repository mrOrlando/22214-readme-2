import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class HealthRdo {
  @ApiProperty({
    description: 'ok when all services answer, degraded otherwise',
    enum: ['ok', 'degraded'],
  })
  @Expose()
  public status!: 'ok' | 'degraded';

  @ApiProperty({
    description: 'Availability of every service',
    example: { user: true, blog: true, fileServer: true, notification: false },
  })
  @Expose()
  public services!: Record<string, boolean>;
}
