import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [ClientsModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
