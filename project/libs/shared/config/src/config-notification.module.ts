import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import appConfig from './app.config';
import mongoConfig from './mongo.config';
import rabbitConfig from './rabbit.config';
import mailConfig from './mail.config';

const ENV_NOTIFICATION_FILE_PATHS = [
  'apps/notification/notification.env',
  resolve(process.cwd(), 'apps/notification/notification.env'),
  resolve(process.cwd(), 'notification.env'),
];

// The env file is read when the module is registered, not when the file is
// imported, so that applications do not load env files of each other.
@Module({})
export class ConfigNotificationModule {
  public static register(): DynamicModule {
    return {
      module: ConfigNotificationModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          load: [appConfig, mongoConfig, rabbitConfig, mailConfig],
          envFilePath: ENV_NOTIFICATION_FILE_PATHS,
        }),
      ],
    };
  }
}
