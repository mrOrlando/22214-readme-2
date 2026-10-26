import { registerAs } from '@nestjs/config';
import Joi from 'joi';

export interface FileConfig {
  uploadDirectory: string;
}

const validationSchema = Joi.object({
  uploadDirectory: Joi.string().required(),
});

function validateConfig(config: FileConfig): void {
  const { error } = validationSchema.validate(config, { abortEarly: true });
  if (error) {
    throw new Error(`[File Config Validation Error]: ${error.message}`);
  }
}

function getConfig(): FileConfig {
  const config: FileConfig = {
    uploadDirectory: process.env.UPLOAD_DIRECTORY ?? '',
  };

  validateConfig(config);
  return config;
}

export default registerAs('file', getConfig);
