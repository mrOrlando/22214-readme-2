import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import appConfig from './app.config';
import mongoConfig from './mongo.config';
import jwtConfig from './jwt.config';
import rabbitConfig from './rabbit.config';

const ENV_USER_FILE_PATHS = [
  'apps/user/user.env',
  resolve(process.cwd(), 'apps/user/user.env'),
  resolve(process.cwd(), 'user.env'),
];

// The env file is read when the module is registered, not when the file is
// imported, so that applications do not load env files of each other.
@Module({})
export class ConfigUserModule {
  public static register(): DynamicModule {
    return {
      module: ConfigUserModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          load: [appConfig, mongoConfig, jwtConfig, rabbitConfig],
          envFilePath: ENV_USER_FILE_PATHS,
        }),
      ],
    };
  }
}
