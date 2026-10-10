import { Injectable, Logger } from '@nestjs/common';
import { PublicationEntity } from './publication.entity';
import { PublicationRepository } from './publication.repository';
import { AddPublicationDto } from './dto/add-publication.dto';

@Injectable()
export class PublicationService {
  private readonly logger = new Logger(PublicationService.name);

  constructor(private readonly publicationRepository: PublicationRepository) {}

  // Idempotent: a repeated event for the same post is ignored
  public async addPublication(
    dto: AddPublicationDto
  ): Promise<PublicationEntity> {
    const existingPublication = await this.publicationRepository.findByPostId(
      dto.postId
    );
    if (existingPublication) {
      this.logger.warn(`The publication of the post ${dto.postId} exists`);
      return existingPublication;
    }

    return this.publicationRepository.save(
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
}
