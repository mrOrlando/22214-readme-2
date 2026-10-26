import { Readable } from 'node:stream';
import {
  BadGatewayException,
  GatewayTimeoutException,
  HttpException,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { isAxiosError } from 'axios';

const TIMEOUT_ERROR_CODES = ['ECONNABORTED', 'ETIMEDOUT', 'ERR_CANCELED'];

async function readStream(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf-8');
}

// The body of a response can be a parsed object, a string or, for streamed
// requests, a stream
async function readBody(data: unknown): Promise<unknown> {
  const body = data instanceof Readable ? await readStream(data) : data;
  if (typeof body !== 'string') {
    return body;
  }

  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

// Turns a failed request to a service to the error of the gateway:
// - 4xx: the answer of the service is passed to the client as it is;
// - 5xx: the service has failed, the client gets 502 without internals;
// - no answer: 503 if the service is unreachable and 504 if it is too slow.
export async function toHttpException(
  error: unknown,
  serviceName: string,
  logger: Logger
): Promise<HttpException> {
  if (!isAxiosError(error)) {
    logger.error(`Unexpected error of the ${serviceName} client: ${error}`);
    return new InternalServerErrorException();
  }

  const { response } = error;

  if (!response) {
    if (error.code && TIMEOUT_ERROR_CODES.includes(error.code)) {
      logger.error(`The ${serviceName} service did not respond in time`);
      return new GatewayTimeoutException(
        `The ${serviceName} service did not respond in time`
      );
    }

    logger.error(`The ${serviceName} service is unavailable: ${error.message}`);
    return new ServiceUnavailableException(
      `The ${serviceName} service is unavailable`
    );
  }

  const body = await readBody(response.data);

  if (response.status >= 400 && response.status < 500) {
    const answer =
      body && typeof body === 'object'
        ? body
        : { message: body || error.message, statusCode: response.status };

    return new HttpException(answer, response.status);
  }

  logger.error(
    `The ${serviceName} service failed with ${
      response.status
    }: ${JSON.stringify(body)}`
  );
  return new BadGatewayException(`The ${serviceName} service failed`);
}
