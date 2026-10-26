import { Module } from '@nestjs/common';
import { ClientsModule } from '../clients/clients.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [ClientsModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
