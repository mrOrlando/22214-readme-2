import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { adapter, PrismaClient } from './prisma-client';

@Injectable()
export class PrismaClientService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      adapter,
      log:
        process.env.NODE_ENV === 'production'
          ? ['error']
          : ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
