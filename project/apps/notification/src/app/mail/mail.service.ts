import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { PublicationEntity } from '../publication/publication.entity';
import { compileDigestTemplates, DigestTemplates } from './mail.templates';
import { MAIL_DIGEST_SUBJECT } from './mail.constants';

@Injectable()
export class MailService implements OnModuleInit {
  private transporter!: Transporter;
  private from!: string;
  private templates!: DigestTemplates;

  constructor(private readonly configService: ConfigService) {}

  public onModuleInit(): void {
    const user = this.configService.get<string>('mail.user');
    const password = this.configService.get<string>('mail.password');

    this.templates = compileDigestTemplates();
    this.from = this.configService.getOrThrow<string>('mail.from');
    this.transporter = createTransport({
      host: this.configService.getOrThrow<string>('mail.host'),
      port: this.configService.getOrThrow<number>('mail.port'),
      secure: false,
      auth: user && password ? { user, pass: password } : undefined,
    });
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
