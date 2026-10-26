import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import mongoConfig from './mongo.config';
import rabbitConfig from './rabbit.config';
import mailConfig from './mail.config';
import { getConfigModuleOptions } from './get-config-module-options';

// The env file is read when the module is registered, not when the file is
// imported, so that applications do not load env files of each other.
@Module({})
export class ConfigNotificationModule {
  public static register(): DynamicModule {
    return {
      module: ConfigNotificationModule,
      imports: [
        ConfigModule.forRoot(
          getConfigModuleOptions('notification', [
            appConfig,
            mongoConfig,
            rabbitConfig,
            mailConfig,
          ])
        ),
      ],
    };
  }
}
