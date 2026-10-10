import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigNotificationModule, getMongooseOptions } from '@project/config';

@Module({
  imports: [
    ConfigNotificationModule.register(),
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
})
export class AppModule {}
