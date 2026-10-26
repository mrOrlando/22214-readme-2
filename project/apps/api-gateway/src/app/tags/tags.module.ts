import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { TagsController } from './tags.controller';

@Module({
  imports: [ClientsModule],
  controllers: [TagsController],
})
export class TagsModule {}
