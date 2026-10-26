import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionModel, SubscriptionSchema } from './subscription.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubscriptionModel.name, schema: SubscriptionSchema },
    ]),
  ],
  providers: [SubscriptionRepository],
  exports: [SubscriptionRepository],
})
export class SubscriptionModule {}
