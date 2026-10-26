import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { PublicUserRdo } from './public-user.rdo';

// The number of publications of the user is not known here: it belongs
// to the blog service and is added by the API Gateway
export class UserDetailsRdo extends PublicUserRdo {
  @ApiProperty({ description: 'Registration date' })
  @Expose()
  public registeredAt!: Date;

  @ApiProperty({ description: 'Number of subscribers', example: 12 })
  @Expose()
  public subscribersCount!: number;
}
