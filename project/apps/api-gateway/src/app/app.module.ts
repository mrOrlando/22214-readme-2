import { Module } from '@nestjs/common';
import { ConfigApiGatewayModule } from '@project/config';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigApiGatewayModule.register(),
    ClientsModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {}
