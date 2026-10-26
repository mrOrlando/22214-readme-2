import { Injectable } from '@nestjs/common';
import { PublicationEntity } from './publication.entity';
import { PublicationRepository } from './publication.repository';
import { AddPublicationDto } from './dto/add-publication.dto';

@Injectable()
export class PublicationService {
  constructor(private readonly publicationRepository: PublicationRepository) {}

  // Idempotent: a repeated event for the same post is ignored
  public async addPublication(
    dto: AddPublicationDto
  ): Promise<PublicationEntity> {
    return this.publicationRepository.saveIfNew(
      new PublicationEntity({ ...dto, publishedAt: new Date(dto.publishedAt) })
    );
  }

  public async getNotSentPublications(): Promise<PublicationEntity[]> {
    return this.publicationRepository.findNotSent();
  }

  public async markAsSent(publications: PublicationEntity[]): Promise<void> {
    await this.publicationRepository.markAsSent(
      publications.map(({ id }) => `${id}`),
      new Date()
    );
  }

  // Remembers the subscribers who have already received the publications
  // of a mailing that is not finished yet
  public async markAsDelivered(
    publications: PublicationEntity[],
    subscriberIds: string[]
  ): Promise<void> {
    await this.publicationRepository.addRecipients(
      publications.map(({ id }) => `${id}`),
      subscriberIds
    );
  }
}
