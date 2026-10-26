import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { HealthController } from './health.controller';

@Module({
  imports: [ClientsModule],
  controllers: [HealthController],
})
export class HealthModule {}
