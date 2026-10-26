import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { PublicationEntity } from '../publication/publication.entity';
import { compileDigestTemplates, DigestTemplates } from './mail.templates';
import {
  MAIL_DIGEST_SUBJECT,
  MAX_SMTP_CONNECTIONS,
  SMTPS_PORT,
} from './mail.constants';

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
  private transporter!: Transporter;
  private from!: string;
  private templates!: DigestTemplates;

  constructor(private readonly configService: ConfigService) {}

  public onModuleInit(): void {
    const user = this.configService.get<string>('mail.user');
    const password = this.configService.get<string>('mail.password');
    const port = this.configService.getOrThrow<number>('mail.port');

    this.templates = compileDigestTemplates();
    this.from = this.configService.getOrThrow<string>('mail.from');
    // Letters wait in the queue of the pool instead of opening
    // a connection per letter
    this.transporter = createTransport({
      pool: true,
      maxConnections: MAX_SMTP_CONNECTIONS,
      host: this.configService.getOrThrow<string>('mail.host'),
      port,
      // TLS from the start on the SMTPS port, STARTTLS when offered otherwise
      secure: port === SMTPS_PORT,
      auth: user && password ? { user, pass: password } : undefined,
    });
  }

  public onModuleDestroy(): void {
    this.transporter.close();
  }

  public async sendDigest(
    recipient: { email: string; name: string },
    publications: PublicationEntity[]
  ): Promise<void> {
    const context = { name: recipient.name, publications };

    await this.transporter.sendMail({
      from: this.from,
      to: recipient.email,
      subject: MAIL_DIGEST_SUBJECT,
      html: this.templates.html(context),
      text: this.templates.text(context),
    });
  }
}
