import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import mongoConfig from './mongo.config';
import jwtConfig from './jwt.config';
import rabbitConfig from './rabbit.config';
import { getConfigModuleOptions } from './get-config-module-options';

// The env file is read when the module is registered, not when the file is
// imported, so that applications do not load env files of each other.
@Module({})
export class ConfigUserModule {
  public static register(): DynamicModule {
    return {
      module: ConfigUserModule,
      imports: [
        ConfigModule.forRoot(
          getConfigModuleOptions('user', [
            appConfig,
            mongoConfig,
            jwtConfig,
            rabbitConfig,
          ])
        ),
      ],
    };
  }
}
