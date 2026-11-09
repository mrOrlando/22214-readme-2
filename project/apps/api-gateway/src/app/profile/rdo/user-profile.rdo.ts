import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AuthorRdo } from '../../users/author.rdo';

export class UserProfileRdo extends AuthorRdo {
  @ApiProperty({ description: 'Registration date' })
  @Expose()
  public registeredAt!: string;

  @ApiProperty({ description: 'Number of subscribers', example: 12 })
  @Expose()
  public subscribersCount!: number;

  @ApiProperty({
    description: 'Number of published posts of the user',
    example: 7,
  })
  @Expose()
  public postsCount!: number;

  @ApiProperty({
    description:
      'Whether the current user is subscribed to this user. It is always false without the access token',
  })
  @Expose()
  public isSubscribed!: boolean;
}
