import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenPayload } from '@project/types';

// For public routes that show more to a logged in user: a missing or
// invalid token is not an error, the request is just anonymous
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  public override handleRequest<TUser = TokenPayload>(
    _error: unknown,
    user: TUser | false
  ): TUser {
    return (user || undefined) as TUser;
  }
}
