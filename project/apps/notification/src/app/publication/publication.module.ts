import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PublicationController } from './publication.controller';
import { PublicationRepository } from './publication.repository';
import { PublicationModel, PublicationSchema } from './publication.schema';
import { PublicationService } from './publication.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PublicationModel.name, schema: PublicationSchema },
    ]),
  ],
  controllers: [PublicationController],
  providers: [PublicationRepository, PublicationService],
  exports: [PublicationService],
})
export class PublicationModule {}
