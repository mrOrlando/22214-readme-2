import { Module } from '@nestjs/common';
import { ConfigApiGatewayModule } from '@project/config';
import { ClientsModule } from './clients/clients.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [ConfigApiGatewayModule.register(), ClientsModule, HealthModule],
})
export class AppModule {}
