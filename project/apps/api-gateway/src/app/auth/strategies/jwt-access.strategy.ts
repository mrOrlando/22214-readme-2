import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TokenPayload } from '@project/types';

// The gateway checks the signature and the lifetime of an access token itself
// and does not ask the user service about every request
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>(
        'gateway.accessTokenSecret'
      ),
    });
  }

  public validate({ sub, email, name }: TokenPayload): TokenPayload {
    return { sub, email, name };
  }
}
