import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export interface ApiGatewayConfig {
  userServiceUrl: string;
  blogServiceUrl: string;
  fileServerUrl: string;
  notificationServiceUrl: string;
  accessTokenSecret: string;
  corsOrigins: string[];
}

const validationSchema = Joi.object({
  userServiceUrl: Joi.string().uri().required(),
  blogServiceUrl: Joi.string().uri().required(),
  fileServerUrl: Joi.string().uri().required(),
  notificationServiceUrl: Joi.string().uri().required(),
  accessTokenSecret: Joi.string().required(),
  corsOrigins: Joi.array().items(Joi.string().uri()),
});

function validateConfig(config: ApiGatewayConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[API Gateway Config Validation Error]: ${error.message}`);
  }
}

function removeTrailingSlash(url = ''): string {
  return url.replace(/\/+$/, '');
}

function getConfig(): ApiGatewayConfig {
  const config: ApiGatewayConfig = {
    userServiceUrl: removeTrailingSlash(process.env.USER_SERVICE_URL),
    blogServiceUrl: removeTrailingSlash(process.env.BLOG_SERVICE_URL),
    fileServerUrl: removeTrailingSlash(process.env.FILE_SERVER_URL),
    notificationServiceUrl: removeTrailingSlash(
      process.env.NOTIFICATION_SERVICE_URL
    ),
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET ?? '',
    // Addresses of the frontend that may call the API, comma separated
    corsOrigins: (process.env.CORS_ORIGINS ?? '')
      .split(',')
      .map((origin) => removeTrailingSlash(origin.trim()))
      .filter(Boolean),
  };

  validateConfig(config);
  return config;
}

export default registerAs('gateway', getConfig);
