import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigNotificationModule, getMongooseOptions } from '@project/config';
import { EmailSubscriberModule } from './email-subscriber/email-subscriber.module';

@Module({
  imports: [
    ConfigNotificationModule.register(),
    MongooseModule.forRootAsync(getMongooseOptions()),
    EmailSubscriberModule,
  ],
})
export class AppModule {}
