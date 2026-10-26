import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSubscriberController } from './email-subscriber.controller';
import { EmailSubscriberRepository } from './email-subscriber.repository';
import {
  EmailSubscriberModel,
  EmailSubscriberSchema,
} from './email-subscriber.schema';
import { EmailSubscriberService } from './email-subscriber.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailSubscriberModel.name, schema: EmailSubscriberSchema },
    ]),
  ],
  controllers: [EmailSubscriberController],
  providers: [EmailSubscriberRepository, EmailSubscriberService],
  exports: [EmailSubscriberService],
})
export class EmailSubscriberModule {}
