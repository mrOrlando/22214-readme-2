import { ConfigService } from '@nestjs/config';
import {
  ClientsProviderAsyncOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { RABBITMQ_SERVICE } from '@project/helpers';

export function getRabbitMQUrl(config: ConfigService): string {
  const user = encodeURIComponent(config.getOrThrow<string>('rabbit.user'));
  const password = encodeURIComponent(
    config.getOrThrow<string>('rabbit.password')
  );
  const host = config.getOrThrow<string>('rabbit.host');
  const port = config.getOrThrow<number>('rabbit.port');

  return `amqp://${user}:${password}@${host}:${port}`;
}

// Options of the microservice that consumes messages of the queue
export function getRabbitMQServerOptions(config: ConfigService): RmqOptions {
  return {
    transport: Transport.RMQ,
    options: {
      urls: [getRabbitMQUrl(config)],
      queue: config.getOrThrow<string>('rabbit.queue'),
      noAck: false,
      persistent: true,
      queueOptions: { durable: true },
    },
  };
}

// Options of the client that publishes messages to the queue.
// The client does not set noAck: it consumes only its own reply queue.
export function getRabbitMQClientOptions(): ClientsProviderAsyncOptions {
  return {
    name: RABBITMQ_SERVICE,
    inject: [ConfigService],
    useFactory: (config: ConfigService): RmqOptions => ({
      transport: Transport.RMQ,
      options: {
        urls: [getRabbitMQUrl(config)],
        queue: config.getOrThrow<string>('rabbit.queue'),
        persistent: true,
        queueOptions: { durable: true },
      },
    }),
  };
}
