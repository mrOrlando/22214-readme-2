import { Module } from '@nestjs/common';
import { ConfigApiGatewayModule } from '@project/config';

@Module({
  imports: [ConfigApiGatewayModule.register()],
})
export class AppModule {}
