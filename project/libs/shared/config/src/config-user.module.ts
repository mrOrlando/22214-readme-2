import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from './app.config';
import mongoConfig from './mongo.config';

const ENV_USER_FILE_PATH = 'apps/user/user.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, mongoConfig],
      envFilePath: ENV_USER_FILE_PATH,
    }),
  ],
})
export class ConfigUserModule {}
