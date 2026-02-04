import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import appConfig from './app.config';
import mongoConfig from './mongo.config';

const ENV_USER_FILE_PATHS = [
  'apps/user/user.env',
  resolve(process.cwd(), 'apps/user/user.env'),
  resolve(process.cwd(), 'user.env'),
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [appConfig, mongoConfig],
      envFilePath: ENV_USER_FILE_PATHS,
    }),
  ],
})
export class ConfigUserModule {}
