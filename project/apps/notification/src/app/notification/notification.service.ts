import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { EmailSubscriberService } from '../email-subscriber/email-subscriber.service';
import { MailService } from '../mail/mail.service';
import { PublicationService } from '../publication/publication.service';

export interface SendingResult {
  publications: number;
  recipients: number;
  sent: number;
  failed: number;
}

const SENDING_IN_PROGRESS_ERROR = 'The mailing is already in progress';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private isSending = false;

  constructor(
    private readonly publicationService: PublicationService,
    private readonly emailSubscriberService: EmailSubscriberService,
    private readonly mailService: MailService
  ) {}

  // Sends new publications since the last mailing to all subscribers.
  // Publications are marked as sent only when every letter has been sent,
  // so a failed mailing can be repeated.
  public async sendNewPublications(): Promise<SendingResult> {
    if (this.isSending) {
      throw new ConflictException(SENDING_IN_PROGRESS_ERROR);
    }

    this.isSending = true;

    try {
      const publications =
        await this.publicationService.getNotSentPublications();
      const subscribers = await this.emailSubscriberService.getAllSubscribers();

      if (publications.length === 0 || subscribers.length === 0) {
        return {
          publications: publications.length,
          recipients: subscribers.length,
          sent: 0,
          failed: 0,
        };
      }

      const results = await Promise.allSettled(
        subscribers.map((subscriber) =>
          this.mailService.sendDigest(subscriber, publications)
        )
      );

      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          this.logger.error(
            `Failed to send the letter to ${subscribers[index].email}: ${result.reason}`
          );
        }
      });

      const failed = results.filter(
        ({ status }) => status === 'rejected'
      ).length;
      if (failed === 0) {
        await this.publicationService.markAsSent(publications);
      }

      return {
        publications: publications.length,
        recipients: subscribers.length,
        sent: results.length - failed,
        failed,
      };
    } finally {
      this.isSending = false;
    }
  }
}
