import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshTokenPayload } from '@project/types';
import { RefreshTokenService } from '../../refresh-token/refresh-token.service';
import { AUTH_REFRESH_TOKEN_NOT_FOUND } from '../auth.constants';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(
    configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.refreshTokenSecret'),
    });
  }

  public async validate({ sub, email, name, tokenId }: RefreshTokenPayload) {
    if (!(await this.refreshTokenService.isExists(tokenId))) {
      throw new UnauthorizedException(AUTH_REFRESH_TOKEN_NOT_FOUND);
    }

    // A refresh token can be used only once
    await this.refreshTokenService.deleteRefreshSession(tokenId);

    return { sub, email, name };
  }
}
