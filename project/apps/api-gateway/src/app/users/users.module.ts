import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { AuthorsService } from './authors.service';

@Module({
  imports: [ClientsModule],
  providers: [AuthorsService],
  exports: [AuthorsService],
})
export class UsersModule {}
