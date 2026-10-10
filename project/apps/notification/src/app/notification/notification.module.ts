import { Module } from '@nestjs/common';
import { EmailSubscriberModule } from '../email-subscriber/email-subscriber.module';
import { MailModule } from '../mail/mail.module';
import { PublicationModule } from '../publication/publication.module';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [EmailSubscriberModule, PublicationModule, MailModule],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
