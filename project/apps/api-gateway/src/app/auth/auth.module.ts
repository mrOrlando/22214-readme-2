import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { AuthController } from './auth.controller';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [ClientsModule],
  controllers: [AuthController],
  providers: [JwtAccessStrategy],
})
export class AuthModule {}
