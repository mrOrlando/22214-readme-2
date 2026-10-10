import { registerAs } from '@nestjs/config';
import Joi from 'joi';

const DEFAULT_SMTP_PORT = 25;

export interface MailConfig {
  host: string;
  port: number;
  user?: string;
  password?: string;
  from: string;
}

const validationSchema = Joi.object({
  host: Joi.string().hostname().required(),
  port: Joi.number().port().default(DEFAULT_SMTP_PORT),
  user: Joi.string().allow('').optional(),
  password: Joi.string().allow('').optional(),
  from: Joi.string().required(),
});

function validateConfig(config: MailConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[Mail Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): MailConfig {
  const config: MailConfig = {
    host: process.env.MAIL_SMTP_HOST ?? '',
    port: parseInt(process.env.MAIL_SMTP_PORT ?? `${DEFAULT_SMTP_PORT}`, 10),
    user: process.env.MAIL_USER_NAME,
    password: process.env.MAIL_USER_PASSWORD,
    from: process.env.MAIL_FROM ?? '',
  };

  validateConfig(config);
  return config;
}

export default registerAs('mail', getConfig);
