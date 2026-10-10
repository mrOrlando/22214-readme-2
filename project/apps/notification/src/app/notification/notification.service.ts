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
  // so a failed mailing can be repeated. Subscribers who have received
  // their letter are remembered and do not get it again on a repeat.
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

      const letters = subscribers
        .map((subscriber) => ({
          subscriber,
          digest: publications.filter(
            ({ deliveredTo }) => !deliveredTo.includes(`${subscriber.id}`)
          ),
        }))
        .filter(({ digest }) => digest.length > 0);

      // The mail transport limits the number of simultaneous connections
      const results = await Promise.allSettled(
        letters.map(({ subscriber, digest }) =>
          this.mailService.sendDigest(subscriber, digest)
        )
      );

      const deliveredTo: string[] = [];
      results.forEach((result, index) => {
        const { subscriber } = letters[index];
        if (result.status === 'rejected') {
          this.logger.error(
            `Failed to send the letter to ${subscriber.email}: ${result.reason}`
          );
          return;
        }
        deliveredTo.push(`${subscriber.id}`);
      });

      const failed = letters.length - deliveredTo.length;
      if (failed === 0) {
        await this.publicationService.markAsSent(publications);
      } else if (deliveredTo.length > 0) {
        await this.publicationService.markAsDelivered(
          publications,
          deliveredTo
        );
      }

      return {
        publications: publications.length,
        recipients: subscribers.length,
        sent: deliveredTo.length,
        failed,
      };
    } finally {
      this.isSending = false;
    }
  }
}
