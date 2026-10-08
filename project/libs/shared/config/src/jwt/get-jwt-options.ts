import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export async function getJwtOptions(
  configService: ConfigService
): Promise<JwtModuleOptions> {
  return {
    secret: configService.getOrThrow<string>('jwt.accessTokenSecret'),
    signOptions: {
      expiresIn: configService.getOrThrow('jwt.accessTokenExpiresIn'),
      algorithm: 'HS256',
    },
  };
}
