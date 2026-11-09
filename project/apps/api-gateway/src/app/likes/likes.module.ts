import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { LikesController } from './likes.controller';

@Module({
  imports: [ClientsModule],
  controllers: [LikesController],
})
export class LikesModule {}
