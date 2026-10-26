import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { FilesController } from './files.controller';

@Module({
  imports: [ClientsModule],
  controllers: [FilesController],
})
export class FilesModule {}
