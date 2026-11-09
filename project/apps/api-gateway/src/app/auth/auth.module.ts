import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { FilesModule } from '../files/files.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [ClientsModule, FilesModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy],
})
export class AuthModule {}
