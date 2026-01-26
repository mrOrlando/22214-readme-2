import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigUserModule } from '@project/config';

@Module({
  imports: [AuthModule, UserModule, ConfigUserModule],
})
export class AppModule {}
