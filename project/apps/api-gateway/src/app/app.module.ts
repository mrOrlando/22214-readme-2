import { Module } from '@nestjs/common';
import { ConfigApiGatewayModule } from '@project/config';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [ConfigApiGatewayModule.register(), ClientsModule],
})
export class AppModule {}
