import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigUserModule, getMongooseOptions } from '@project/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigUserModule.register(),
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
})
export class AppModule {}
